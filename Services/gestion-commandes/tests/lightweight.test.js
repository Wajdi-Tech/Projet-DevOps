import { jest } from '@jest/globals';

// 1. Mock Mongoose BEFORE importing app
// We need to mock 'mongoose' because routes/orderRoutes.js calls mongoose.createConnection() at top-level.
jest.unstable_mockModule('mongoose', () => ({
    default: {
        connect: jest.fn(),
        createConnection: jest.fn().mockReturnValue({
            model: jest.fn().mockReturnValue({
                // Mock model methods if needed, though health check shouldn't touch them
                find: jest.fn(),
                findById: jest.fn(),
            }),
        }),
        Schema: class {
            static Types = {
                ObjectId: 'ObjectId',
            };
        },
        model: jest.fn(),
    },
}));

// 2. Import helpers and the app dynamically
const { describe, it, expect, beforeAll } = await import('@jest/globals');
const request = (await import('supertest')).default;
const app = (await import('../app.js')).default; // Note: app.js was 'export default app'

describe('Order Service - 5 Checks', () => {

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
        const res = await request(app).get('/api/unknown-order-route');
        expect(res.statusCode).toBe(404);
    });

    // 5. Method Not Allowed (Simulated)
    it('POST /health should return 404 (Method Not Defined)', async () => {
        const res = await request(app).post('/health');
        expect(res.statusCode).toBe(404);
    });
});
