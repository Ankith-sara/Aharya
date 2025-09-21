import request from 'supertest';
import app from '../../server.js';   // Your Express app
import { expect } from 'chai';

describe('orders API', () => {
  const userId = '67f266e95a392452e5434260';  // Example user ID
  const company = 'Aharyas';  // Example company name
  const YOUR_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjI2NmU5NWEzOTI0NTJlNTQzNDI2MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU4MDIyMzY0LCJleHAiOjE3NTg2MjcxNjR9.6LgBFVLx6o2D0cBlfWQqbmJ0ZCfYTm2BCL8ol2YotHc';
  

  const orderData = {
    userId,
    items: [{ productId: '64f234567890abcdef12345', name: 'T-Shirt', price: 500, quantity: 2 }],
    amount: 1000,
    address: { street: '123 Street', city: 'Mumbai', zip: '400001' }
  };

  it('should place an order with Razorpay', (done) => {
    request(app).post('/api/order/razorpay')
      .set('Authorization', token)
      .send(orderData)
      .expect(200, done);
  });

  it('should place an order with Stripe', (done) => {
    request(app).post('/api/order/stripe')
      .set('Authorization', token)
      .send(orderData)
      .expect(200, done);
  });

  it('should fetch user orders', (done) => {
    request(app).post('/api/order/userorders')
      .set('Authorization', token)
      .send({ userId })
      .expect(200, done);
  });

  it('should update order status', (done) => {
    request(app).post('/api/order/status')
      .set('Authorization', token)
      .send({ orderId: 'test-order', status: 'shipped' })
      .expect(200, done);
  });

  it('should reject order if token missing', (done) => {
    request(app).post('/api/order/razorpay')
      .send(orderData)
      .expect(401, done);
  });

  it('should reject order if items missing', (done) => {
    request(app).post('/api/order/razorpay')
      .set('Authorization', token)
      .send({ userId, amount: 100 })
      .expect(400, done);
  });

  it('should return 404 if order not found', (done) => {
    request(app).post('/api/order/status')
      .set('Authorization', token)
      .send({ orderId: 'invalid', status: 'shipped' })
      .expect(404, done);
  });

  it('should return array of orders', (done) => {
    request(app).post('/api/order/userorders')
      .set('Authorization', token)
      .send({ userId })
      .end((err, res) => {
        expect(res.body.orders).to.be.an('array');
        done();
      });
  });

  it('should return JSON response', (done) => {
    request(app).post('/api/order/razorpay')
      .set('Authorization', token)
      .send(orderData)
      .end((err, res) => {
        expect(res.headers['content-type']).to.include('application/json');
        done();
      });
  });

  it('should handle server crash gracefully', (done) => {
    request(app).post('/api/order/razorpay/error-test')
      .set('Authorization', token)
      .send(orderData)
      .expect(500, done);
  });
});
