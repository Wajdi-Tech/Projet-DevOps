import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../../app.js';

// We need to mock the models, but since they are likely imported in controllers, 
// we might need to mock the controller or the mongoose model itself.
// For now, let's test the health endpoint which has no DB dependency.

describe('Order Service Tests (Lightweight)', () => {

    describe('GET /health', () => {
        it('should return UP status', async () => {
            const res = await request(app).get('/health');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ status: 'UP' });
        });
    });

    // Future: Mock mongoose.model('Order') to test create/get logic
});
