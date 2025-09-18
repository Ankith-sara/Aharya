import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';
import SwaggerParser from '@apidevtools/swagger-parser';
import OpenAPIResponseValidatorPkg from 'openapi-response-validator';
const OpenAPIResponseValidator = OpenAPIResponseValidatorPkg.default || OpenAPIResponseValidatorPkg;

const API_BASE = 'http://localhost:4000/api';
const OPENAPI_FILE = './openapi.yml';

let apiSpec;
let responseValidators = {};

beforeAll(async () => {
  apiSpec = await SwaggerParser.validate(OPENAPI_FILE);

  // Prepare response validators for each path and method
  Object.keys(apiSpec.paths).forEach((path) => {
    responseValidators[path] = {};
    Object.keys(apiSpec.paths[path]).forEach((method) => {
      responseValidators[path][method] = new OpenAPIResponseValidator({
        responses: apiSpec.paths[path][method].responses,
      });
    });
  });
}, 30000);

describe('Contract Tests for E-Commerce API', () => {
  const testUserId = '6814b849423aba9630234b24'; // Separated userId

  it('GET /user/profile/{id} should return valid 200 response', async () => {
    const res = await fetch(`${API_BASE}/user/profile/${testUserId}`);
    const data = await res.json();

    const validation = responseValidators['/user/profile/{id}']['get'];
    const result = validation.validateResponse(res.status, data);
    expect(result).toBeUndefined();
  });

  it('PUT /user/profile/{id} should return valid 200 response', async () => {
    const res = await fetch(`${API_BASE}/user/profile/${testUserId}`, {
      method: 'PUT',
    });
    const data = await res.json();

    const validation = responseValidators['/user/profile/{id}']['put'];
    const result = validation.validateResponse(res.status, data);
    expect(result).toBeUndefined();
  });

  it('GET /product/company/{company} should return valid 200 response', async () => {
    const company = 'Aharyas';
    const res = await fetch(`${API_BASE}/product/company/${company}`);
    const data = await res.json();

    const validation = responseValidators['/product/company/{company}']['get'];
    const result = validation.validateResponse(res.status, data);
    expect(result).toBeUndefined();
  });

  it('GET /product/companies should return valid 200 response', async () => {
    const res = await fetch(`${API_BASE}/product/companies`);
    const data = await res.json();

    const validation = responseValidators['/product/companies']['get'];
    const result = validation.validateResponse(res.status, data);
    expect(result).toBeUndefined();
  });

  it('POST /order/stripe should return valid 200 response', async () => {
    const payload = {
      userId: testUserId,
      items: [],
      amount: 100,
      address: '123 Street',
    };

    const res = await fetch(`${API_BASE}/order/stripe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    const validation = responseValidators['/order/stripe']['post'];
    const result = validation.validateResponse(res.status, data);
    expect(result).toBeUndefined();
  });

  it('POST /order/razorpay should return valid 200 response', async () => {
    const payload = {
      userId: testUserId,
      items: [],
      amount: 100,
      address: '123 Street',
    };

    const res = await fetch(`${API_BASE}/order/razorpay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    const validation = responseValidators['/order/razorpay']['post'];
    const result = validation.validateResponse(res.status, data);
    expect(result).toBeUndefined();
  });

  it('POST /order/userorders should return valid 200 response', async () => {
    const payload = { userId: testUserId };

    const res = await fetch(`${API_BASE}/order/userorders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    const validation = responseValidators['/order/userorders']['post'];
    const result = validation.validateResponse(res.status, data);
    expect(result).toBeUndefined();
  });

  it('POST /order/status should return valid 200 response', async () => {
    const payload = { orderId: 'test-order', status: 'shipped' };

    const res = await fetch(`${API_BASE}/order/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    const validation = responseValidators['/order/status']['post'];
    const result = validation.validateResponse(res.status, data);
    expect(result).toBeUndefined();
  });
});
