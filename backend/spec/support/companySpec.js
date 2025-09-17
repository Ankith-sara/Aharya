import request from 'supertest';
import app from '../../server.js';   // Your Express app
import { expect } from 'chai';

describe('companies API', () => {
  const userId = '67f266e95a392452e5434260';  // Example user ID
  const company = 'Aharyas';  // Example company name

  // Test for Get Products by Company
  it('should fetch products for a specific company', (done) => {
    request(app)
      .get(`/api/product/company/${company}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  // Test for Get All Companies (Updated to use GET)
  it('should fetch a list of all companies', (done) => {
    request(app)
      .get('/api/product/companies')  // Changed POST to GET
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
});
