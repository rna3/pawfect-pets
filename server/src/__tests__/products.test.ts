import request from 'supertest';
import app from '../server';
import Product from '../models/Product';
import User from '../models/User';
import sequelize from '../config/database';
import jwt from 'jsonwebtoken';
import '../models'; // Import to establish relationships

let adminToken: string;
let userToken: string;

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  // Create admin user
  const admin = await User.create({
    username: 'admin',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
  });

  // Create regular user
  const user = await User.create({
    username: 'user',
    email: 'user@test.com',
    password: 'password123',
    role: 'user',
  });

  adminToken = jwt.sign(
    { id: admin.id, username: admin.username, email: admin.email, role: admin.role },
    process.env.JWT_SECRET || 'secret'
  );

  userToken = jwt.sign(
    { id: user.id, username: user.username, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'secret'
  );
});

afterAll(async () => {
  await sequelize.close();
});

describe('Product Routes', () => {
  describe('GET /api/products', () => {
    it('should get all products', async () => {
      await Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 29.99,
        category: 'Test',
        stock: 10,
      });

      const res = await request(app).get('/api/products');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/products', () => {
    it('should create product as admin', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Product',
          description: 'New Description',
          price: 39.99,
          category: 'New Category',
          stock: 20,
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('name', 'New Product');
    });

    it('should not create product as regular user', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'New Product',
          description: 'New Description',
          price: 39.99,
          category: 'New Category',
          stock: 20,
        });

      expect(res.status).toBe(403);
    });
  });
});

