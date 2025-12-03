/*******************************************************
 * root.test.js
 * Jest + Supertest tests for root + Swagger routes
 *******************************************************/

const request = require('supertest');
const app = require('../../server');

/* ******************************************
 * ROOT ROUTE TESTS
 * ------------------------------------------ */
describe('Home route', () => {
  it('GET / responds with 200 and returns HTML', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Holiday Party Planner');
  });
});

/* ******************************************
 * SWAGGER ROUTE TESTS
 * ------------------------------------------ */
describe('Swagger route', () => {
  it('GET /api-docs responds with 200', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.status).toBe(200);
  });
});
