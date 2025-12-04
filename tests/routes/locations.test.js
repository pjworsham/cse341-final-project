/*******************************************************
 * locations.test.js
 * Jest + Supertest route tests for Locations
 * Uses controller mocks to avoid hitting MongoDB
 *******************************************************/

const request = require('supertest');

/* ******************************************
 * Controller Mocks (Locations)
 * ------------------------------------------ */
jest.mock('../../controllers/locations', () => ({
  // Simulate GET /locations (GetAll)
  getAllLocations: (req, res) =>
    res.status(200).json([{ _id: 'loc1', name: 'Test Location' }]),

  // Simulate GET /locations/:id (Get)
  getSingleLocations: (req, res) => {
    const { id } = req.params;

    // Simulate invalid ObjectId behavior
    if (!id || id === 'invalid-id') {
      return res
        .status(400)
        .json('Must use a valid locations id to find a locations.');
    }

    // Simulate "not found" behavior
    if (id === 'not-found-id') {
      return res
        .status(404)
        .json({ message: 'locations not found' });
    }

    // Good path: found a location
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      _id: id,
      name: 'Test Location',
    });
  },

  createLocations: jest.fn(),
  updateLocations: jest.fn(),
  deleteLocations: jest.fn(),
}));

/* ******************************************
 * Require app AFTER mocks / before tests
 * ------------------------------------------ */
const app = require('../../server');

/* ******************************************
 * LOCATIONS ROUTES TESTS
 * ------------------------------------------ */
describe('Locations GET routes', () => {
  it('GET /locations returns 200 + array (GetAll)', async () => {
    const res = await request(app).get('/locations');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /locations/:id returns 200 + location object (Get)', async () => {
    const testId = 'location123'; // dummy id treated as valid
    const res = await request(app).get(`/locations/${testId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', testId);
    expect(res.body).toHaveProperty('name', 'Test Location');
  });

  it('GET /locations/:id returns 400 for invalid ID', async () => {
    const res = await request(app).get('/locations/invalid-id');

    expect(res.status).toBe(400);
    expect(res.body).toBe('Must use a valid locations id to find a locations.');
  });

  it('GET /locations/:id returns 404 for non-existing ID', async () => {
    const res = await request(app).get('/locations/not-found-id');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'locations not found' });
  });
});
