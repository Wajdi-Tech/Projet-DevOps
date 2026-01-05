import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../app.js';

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
    // Since we don't have a rigid MethodNotAllowed handler usually in Express unless configured,
    // we can check that a POST to /health doesn't crash or behave weirdly (usually 404 or 200 depending on implementation).
    // Actually, Express defaults to 404 for undefined routes/methods.
    it('POST /health should return 404 (Method Not Defined)', async () => {
        const res = await request(app).post('/health');
        expect(res.statusCode).toBe(404);
    });
});
