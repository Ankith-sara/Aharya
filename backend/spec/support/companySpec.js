import request from 'supertest';
import app from '../../server.js';   // Your Express app
import { expect } from 'chai';

describe('companies API', () => {
  const userId = '67f266e95a392452e5434260';  // Example user ID
  const company = 'Aharyas';  // Example company name

  
  it('should fetch products for a company (200)', (done) => {
    request(app).get(`/api/product/company/${company}`).expect(200, done);
  });

  it('should return 404 for invalid company', (done) => {
    request(app).get('/api/product/company/invalid').expect(404, done);
  });

  it('should fetch all companies (200)', (done) => {
    request(app).get('/api/product/companies').expect(200, done);
  });

  it('should return companies in array format', (done) => {
    request(app).get('/api/product/companies')
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should return 400 if company param missing', (done) => {
    request(app).get('/api/product/company/').expect(400, done);
  });

  it('should return JSON response', (done) => {
    request(app).get(`/api/product/company/${company}`)
      .end((err, res) => {
        expect(res.headers['content-type']).to.include('application/json');
        done();
      });
  });

  it('should handle server error gracefully', (done) => {
    request(app).get('/api/product/company/error-test').expect(500, done);
  });
});
