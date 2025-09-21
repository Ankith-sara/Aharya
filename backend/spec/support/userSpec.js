import request from 'supertest';
import app from '../../server.js';   // Your Express app

import { expect } from 'chai';

describe('User API', () => {
  const userId = '67f266e95a392452e5434260';

  it('GET /user/profile/:id should fetch user profile', (done) => {
    request(app)
      .get(`/api/user/profile/${userId}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('PUT /user/profile/:id should update user profile', (done) => {
  request(app)
    .put(`/api/user/profile/${userId}`)
    .field('name', 'Test_User')  // Update the name
    .end((err, res) => {
      if (err) return done(err);  // Handle any error from the request
      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);  // Check that success is true
      expect(res.body.user.name).to.equal('Test_User');  // Verify the updated name
      done();
    });
});
});
