/*******************************************************
 * gifts.test.js
 * Jest + Supertest route tests for Gifts collection
 * Uses controller mocks to avoid hitting MongoDB
 *******************************************************/

const request = require('supertest');

/* ******************************************
 * Controller Mocks (Gifts)
 * ------------------------------------------ */
jest.mock('../../controllers/gifts', () => ({
  // Simulate GET /gifts (GetAll)
  getAllGifts: (req, res) =>
    res.status(200).json([{ _id: 'abc123', name: 'Test Gift' }]),

  // Simulate GET /gifts/:id (Get)
  getSingleGift: (req, res) => {
    const { id } = req.params;

    // Match the real controller's invalid ObjectId behavior
    if (!id || id === 'invalid-id') {
      return res
        .status(400)
        .json('Must use a valid gift id to find a gift.');
    }

    // Match the real controller's "not found" behavior
    if (id === 'not-found-id') {
      return res
        .status(404)
        .json({ message: 'Gift not found' });
    }

    // Good path: found a gift
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      _id: id,
      name: 'Test Gift',
    });
  },

  createGift: jest.fn(),
  updateGift: jest.fn(),
  deleteGift: jest.fn(),
}));

/* ******************************************
 * Require app AFTER mocks / before tests
 * ------------------------------------------ */
const app = require('../../server');

/* ******************************************
 * GIFTS ROUTES TESTS
 * ------------------------------------------ */
describe('Gifts GET routes', () => {
  it('GET /gifts returns 200 + array (GetAll)', async () => {
    const res = await request(app).get('/gifts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /gifts/:id returns 200 + gift object (Get)', async () => {
    const testId = '12345'; // a dummy id; mock will treat this as valid
    const res = await request(app).get(`/gifts/${testId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', testId);
  });

  it('GET /gifts/:id returns 400 for invalid ID', async () => {
    const res = await request(app).get('/gifts/invalid-id');

    expect(res.status).toBe(400);
    expect(res.body).toBe('Must use a valid gift id to find a gift.');
  });

  it('GET /gifts/:id returns 404 for non-existing ID', async () => {
    const res = await request(app).get('/gifts/not-found-id');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Gift not found' });
  });
});
