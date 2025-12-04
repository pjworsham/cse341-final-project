/*******************************************************
 * food.test.js
 * Jest + Supertest route tests for Food / Dishes
 * Uses controller mocks to avoid hitting MongoDB
 *******************************************************/

const request = require('supertest');

/* ******************************************
 * Controller Mocks (Food / Dishes)
 * ------------------------------------------ */
jest.mock('../../controllers/dish.js', () => ({
  getAllDishes: (req, res) =>
    res.status(200).json([{ name: 'Test Dish' }]),

  getDishById: (req, res) =>
    res.status(200).json({
      _id: req.params.dishId,
      name: 'Test Dish',
    }),

  getDishesByCategory: (req, res) =>
    res.status(200).json([{ categoryId: req.params.categoryId }]),

  getDishesByParticipant: (req, res) =>
    res.status(200).json([{ participantId: req.params.participantId }]),

  createDish: jest.fn(),
  updateDish: jest.fn(),
  deleteDish: jest.fn(),
}));

/* ******************************************
 * Require app AFTER mocks / before tests
 * ------------------------------------------ */
const app = require('../../server');

/* ******************************************
 * FOOD / DISHES ROUTES TESTS
 * ------------------------------------------ */
describe('Food / dishes GET routes', () => {
  it('GET /food/dish returns 200 + array (GetAll)', async () => {
    const res = await request(app).get('/food/dish');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /food/dish/:dishId returns 200 + dish object (Get)', async () => {
    const testId = 'dish123'; // a dummy id; mock will treat this as valid
    const res = await request(app).get(`/food/dish/${testId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', testId);
  });

  it('GET /food/dish/by-category/:categoryId returns 200', async () => {
    const categoryId = 'cat1';
    const res = await request(app).get(`/food/dish/by-category/${categoryId}`);

    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty('categoryId', categoryId);
  });

  it('GET /food/dish/by-participant/:participantId returns 200', async () => {
    const participantId = 'p1';
    const res = await request(app).get(`/food/dish/by-participant/${participantId}`);

    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty('participantId', participantId);
  });
});
