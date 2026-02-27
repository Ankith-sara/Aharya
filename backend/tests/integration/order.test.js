import { describe, test, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../server.js';

describe('Order API', () => {
    test('GET /health returns ok', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    test('POST /api/v1/order/place without auth returns 401', async () => {
        const res = await request(app).post('/api/v1/order/place').send({});
        expect(res.status).toBe(401);
    });

    test('POST /api/v1/user/login with invalid credentials returns 404 or 401', async () => {
        const res = await request(app).post('/api/v1/user/login').send({
            email: 'nonexistent@test.com',
            password: 'wrongpassword'
        });
        expect([401, 404]).toContain(res.status);
    });

    test('GET /api/v1/product/all returns success', async () => {
        const res = await request(app).get('/api/v1/product/all');
        expect(res.status).toBe(200);
    });

    test('GET /api/v1/product/companies returns success', async () => {
        const res = await request(app).get('/api/v1/product/companies');
        expect(res.status).toBe(200);
    });

    test('POST /api/v1/coupon/validate without auth returns 401', async () => {
        const res = await request(app).post('/api/v1/coupon/validate').send({ code: 'TEST10', amount: 500 });
        expect(res.status).toBe(401);
    });
});
