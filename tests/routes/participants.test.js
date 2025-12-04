/*******************************************************
 * participants.test.js
 * Jest + Supertest route tests for Participants
 * Uses controller mocks to avoid hitting MongoDB
 *******************************************************/

const request = require('supertest');

/* ******************************************
 * Controller Mocks (Participants)
 * ------------------------------------------ */
jest.mock('../../controllers/participants', () => ({
  // Simulate GET /participants (GetAll)
  getAllParticipants: (req, res) =>
    res.status(200).json([{ _id: 'p1', firstName: 'Test', lastName: 'Participant' }]),

  // Simulate GET /participants/:id (Get)
  getSingleParticipants: (req, res) => {
    const { id } = req.params;

    // Simulate invalid ObjectId behavior
    if (!id || id === 'invalid-id') {
      return res
        .status(400)
        .json('Must use a valid participants id to find a participants.');
    }

    // Simulate "not found" behavior
    if (id === 'not-found-id') {
      return res
        .status(404)
        .json({ message: 'participants not found' });
    }

    // Good path: found a participant
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      _id: id,
      firstName: 'Test',
      lastName: 'Participant',
    });
  },

  createParticipants: jest.fn(),
  updateParticipants: jest.fn(),
  deleteParticipants: jest.fn(),
}));

/* ******************************************
 * Require app AFTER mocks / before tests
 * ------------------------------------------ */
const app = require('../../server');

/* ******************************************
 * PARTICIPANTS ROUTES TESTS
 * ------------------------------------------ */
describe('Participants GET routes', () => {
  it('GET /participants returns 200 + array (GetAll)', async () => {
    const res = await request(app).get('/participants');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('firstName', 'Test');
  });

  it('GET /participants/:id returns 200 + participant object (Get)', async () => {
    const testId = 'participant123'; // dummy id treated as valid
    const res = await request(app).get(`/participants/${testId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', testId);
    expect(res.body).toHaveProperty('firstName', 'Test');
    expect(res.body).toHaveProperty('lastName', 'Participant');
  });

  it('GET /participants/:id returns 400 for invalid ID', async () => {
    const res = await request(app).get('/participants/invalid-id');

    expect(res.status).toBe(400);
    expect(res.body).toBe('Must use a valid participants id to find a participants.');
  });

  it('GET /participants/:id returns 404 for non-existing ID', async () => {
    const res = await request(app).get('/participants/not-found-id');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'participants not found' });
  });
});
