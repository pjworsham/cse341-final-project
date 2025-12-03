/*******************************************************
 * routes.test.js
 * Jest + Supertest route tests for all GET / GetAll routes
 * Includes controller mocks to avoid hitting MongoDB
 *******************************************************/

const request = require('supertest');

/* ******************************************
 * Controller Mocks (Gifts)
 * ------------------------------------------
 * We mock the gifts controller so the router
 * behaves normally without requiring a DB.
 *******************************************/
jest.mock('../controllers/gifts', () => ({
  getAllGifts: (req, res) =>
    res.status(200).json([{ name: 'Test Gift' }]),

  getSingleGift: (req, res) =>
    res.status(200).json({
      _id: req.params.id,
      name: 'Test Gift',
    }),

  createGift: jest.fn(),
  updateGift: jest.fn(),
  deleteGift: jest.fn(),
}));

/* ******************************************
 * Controller Mocks (Food / Dishes)
 * ------------------------------------------
 * Same idea — mock dish controller so all
 * GET routes respond without DB access.
 *******************************************/
jest.mock('../controllers/dish.js', () => ({
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
 * IMPORTANT: Require app AFTER mocks
 * ------------------------------------------
 * server.js loads the routes when imported.
 * If we required app BEFORE mocking controllers,
 * the real controllers would load!
 *
 * By requiring AFTER the jest.mock calls,
 * our mocked controllers are used instead.
 *******************************************/
const app = require('../server');


/* ******************************************
 * ROOT ROUTE TESTS
 * ------------------------------------------
 * Tests GET / (home page)
 *******************************************/
describe('Home route', () => {
  it('GET / responds with 200 and returns HTML', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Holiday Party Planner');
  });
});


/* ******************************************
 * SWAGGER ROUTE TESTS
 * ------------------------------------------
 * Ensures GET /api-docs loads without error
 *******************************************/
describe('Swagger route', () => {
  it('GET /api-docs responds with 200', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.status).toBe(200);
  });
});


/* ******************************************
 * GIFTS ROUTES TESTS
 * ------------------------------------------
 * Covers:
 *   GET /gifts (GetAll)
 *   GET /gifts/:id (Get)
 *******************************************/
describe('Gifts GET routes', () => {
  it('GET /gifts returns 200 + array (GetAll)', async () => {
    const res = await request(app).get('/gifts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /gifts/:id returns 200 + gift object (Get)', async () => {
    const testId = '12345';
    const res = await request(app).get(`/gifts/${testId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', testId);
  });
});


/* ******************************************
 * FOOD / DISHES ROUTES TESTS
 * ------------------------------------------
 * Covers:
 *   GET /food/dish               (GetAll)
 *   GET /food/dish/:dishId       (Get)
 *   GET /food/dish/by-category   (GetAll filtered)
 *   GET /food/dish/by-participant(GetAll filtered)
 *******************************************/
describe('Food / dishes GET routes', () => {
  it('GET /food/dish returns 200 + array (GetAll)', async () => {
    const res = await request(app).get('/food/dish');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /food/dish/:dishId returns 200 + dish object (Get)', async () => {
    const testId = 'dish123';
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
