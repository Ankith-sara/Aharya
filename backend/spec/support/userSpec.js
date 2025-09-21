import request from 'supertest';
import app from '../server.js';
import { expect } from 'chai';

describe('User API', () => {
  const userId = '67f266e95a392452e5434260';

  it('should fetch user profile (200)', (done) => {
    request(app).get(`/api/user/profile/${userId}`)
      .expect(200, done);
  });

  it('should update user profile (200)', (done) => {
    request(app).put(`/api/user/profile/${userId}`)
      .field('name', 'Test_User')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.user.name).to.equal('Test_User');
        done();
      });
  });

  it('should fail for invalid userId (404)', (done) => {
    request(app).get('/api/user/profile/invalid')
      .expect(404, done);
  });

  it('should return 400 for missing fields on update', (done) => {
    request(app).put(`/api/user/profile/${userId}`)
      .send({})
      .expect(400, done);
  });

  it('should not allow duplicate usernames (409)', (done) => {
    request(app).put(`/api/user/profile/${userId}`)
      .field('name', 'ExistingUser')
      .expect(409, done);
  });

  it('should handle server error gracefully (500)', (done) => {
    request(app).get('/api/user/profile/crash-test')
      .expect(500, done);
  });

  it('should return JSON response for profile fetch', (done) => {
    request(app).get(`/api/user/profile/${userId}`)
      .end((err, res) => {
        expect(res.headers['content-type']).to.include('application/json');
        done();
      });
  });

  it('should not allow unauthorized update', (done) => {
    request(app).put(`/api/user/profile/${userId}`)
      .set('Authorization', '')
      .expect(401, done);
  });
});
