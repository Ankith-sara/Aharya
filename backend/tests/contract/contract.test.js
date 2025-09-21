import fetch from 'node-fetch';
import SwaggerParser from '@apidevtools/swagger-parser';
import OpenAPIResponseValidatorPkg from 'openapi-response-validator';

const OpenAPIResponseValidator = OpenAPIResponseValidatorPkg.default || OpenAPIResponseValidatorPkg;

const API_BASE = 'http://localhost:4001/api';
const OPENAPI_FILE = './openapi.yml';

let apiSpec;
let responseValidators = {};

beforeAll(async () => {
  apiSpec = await SwaggerParser.validate(OPENAPI_FILE);
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
  const userId = '67f266e95a392452e5434260';

  it('GET /user/profile/{id} contract', async () => {
    const res = await fetch(`${API_BASE}/user/profile/${userId}`);
    const data = await res.json();
    const result = responseValidators['/user/profile/{id}']['get'].validateResponse(res.status, data);
    expect(result).toBeUndefined();
  });

  it('PUT /user/profile/{id} contract', async () => {
    const res = await fetch(`${API_BASE}/user/profile/${userId}`, { method: 'PUT' });
    const data = await res.json();
    const result = responseValidators['/user/profile/{id}']['put'].validateResponse(res.status, data);
    expect(result).toBeUndefined();
  });

  it('GET /product/companies contract', async () => {
    const res = await fetch(`${API_BASE}/product/companies`);
    const data = await res.json();
    const result = responseValidators['/product/companies']['get'].validateResponse(res.status, data);
    expect(result).toBeUndefined();
  });

  it('POST /order/razorpay contract', async () => {
    const res = await fetch(`${API_BASE}/order/razorpay`, { method: 'POST' });
    const data = await res.json();
    const result = responseValidators['/order/razorpay']['post'].validateResponse(res.status, data);
    expect(result).toBeUndefined();
  });

  it('POST /order/userorders contract', async () => {
    const res = await fetch(`${API_BASE}/order/userorders`, { method: 'POST' });
    const data = await res.json();
    const result = responseValidators['/order/userorders']['post'].validateResponse(res.status, data);
    expect(result).toBeUndefined();
  });
});
