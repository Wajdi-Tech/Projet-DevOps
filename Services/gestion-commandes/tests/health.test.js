import request from 'supertest';
import express from 'express';

const app = express();
app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));

describe('GET /health', () => {
    it('responds with json', async () => {
        const response = await request(app)
            .get('/health')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual({ status: 'UP' });
    });
});
