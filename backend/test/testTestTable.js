// testTestTable.js
// Basic CRUD tests for TestTable using supertest and jest

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const TestTable = require('../models/TestTable');
const testTableRouter = require('../routes/testTable');

const app = express();
app.use(express.json());
app.use('/api/testtable', testTableRouter);

const uri = 'mongodb+srv://shriya29d_db_user:jqPXUo244WeV9Dhx@booknest.pwqiicn.mongodb.net/?retryWrites=true&w=majority&appName=BookNest';

beforeAll(async () => {
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('TestTable CRUD', () => {
  let id;
  it('should create a new entry', async () => {
    const res = await request(app)
      .post('/api/testtable')
      .send({ name: 'Test User', age: 25, email: 'testuser@example.com' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test User');
    id = res.body._id;
  });
});
