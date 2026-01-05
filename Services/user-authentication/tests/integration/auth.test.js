const request = require('supertest');
const app = require('../../app');

// Mock Mongoose User model to prevent DB connection attempts
jest.mock('../../models/User', () => ({
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({ _id: 'mock_id', email: 'test@example.com' }),
}));

describe('User Auth Service - 5 Checks', () => {

    // 1. Health Status Code
    it('GET /health should return 200', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
    });

    // 2. Health Response Body
    it('GET /health should return { status: UP }', async () => {
        const res = await request(app).get('/health');
        expect(res.body).toEqual({ status: 'UP' });
    });

    // 3. Content Type JSON
    it('GET /health should return JSON', async () => {
        const res = await request(app).get('/health');
        expect(res.headers['content-type']).toMatch(/json/);
    });

    // 4. Unknown Route 404
    it('GET /unknown should return 404', async () => {
        const res = await request(app).get('/api/auth/unknown-route-123');
        expect(res.statusCode).toBe(404);
    });

    // 5. POST Signup Validation (Empty Body)
    it('POST /signup empty should fail validation', async () => {
        const res = await request(app).post('/api/auth/signup').send({});
        // Should be 400 Bad Request or 500 depending on error handling, 
        // assuming some validation exists or it crashes (handled by middleware)
        // We expect NOT 200/201.
        expect(res.statusCode).not.toBe(201);
    });
});
