import request from 'supertest';
import app from '../../server.js';   // Your Express app
import { expect } from 'chai';

describe('orders API', () => {
  const userId = '67f266e95a392452e5434260';  // Example user ID
  const company = 'Aharyas';  // Example company name
  const YOUR_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjI2NmU5NWEzOTI0NTJlNTQzNDI2MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU4NjI4MzMwLCJleHAiOjE3NTkyMzMxMzB9.R7T4ua4z8fkWHlUGk_8Z_WdkMVZBfenbZRs6JbmeOkM';
  
  const orderData = {
    userId,
    items: [{
      productId: '64f234567890abcdef12345',  // Sample product ID
      name: 'T-Shirt',                       // Sample product name
      price: 500,                            // Product price
      quantity: 2                            // Quantity ordered
    }],
    amount: 1050,                            // Total order amount
    address: {
      street: '123 Street, Main St',
      city: 'Mumbai',
      zip: '400001'
    }
  };

  // Test for Place Order with Razorpay
  it('should place an order with Razorpay', (done) => {
    request(app)
      .post('/api/order/razorpay')
      .set('Authorization', `Bearer ${YOUR_TOKEN}`)  // Add the token here
      .send(orderData)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);  // Handle errors properly
        console.log(res.body);  // Log the response to inspect the body
        expect(res.body).to.have.property('order');
        expect(res.body.order).to.have.property('id');  // Expect orderId inside order object
        expect(res.body.order.id).to.be.a('string');
        expect(res.body.order).to.have.property('currency');
        expect(res.body.order.currency).to.equal('INR');
        expect(res.body.order).to.have.property('status');
        expect(res.body.order.status).to.equal('created');
        done();
      });
  });

  // Test for User Orders
  it('should fetch user orders', (done) => {
    request(app)
      .post('/api/order/userorders')
      .set('Authorization', `Bearer ${YOUR_TOKEN}`)  // Add the token here
      .send({ userId })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);  // Handle errors properly
        expect(res.body).to.have.property('orders');
        expect(res.body.orders).to.be.an('array');
        done();
      });
  });
});
