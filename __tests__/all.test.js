const request = require("supertest");
const {app} = require('../server');
const User = require('../models/Users');
const brcrypt = require('bcryptjs');

// Test user credentials
const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    password2: 'password123'
};

// Test student data
const testStudent = {
    name: 'Test Student',
    email: 'test.student@example.com',
    contactNumber: '1234567890',
    address: '123 Test St',
    department: 'Computer Science',
    year: '2023',
    roomNumber: '101',
    parentContact: '9876543210',
    feesPaid: false
};

// Add test data before running tests
beforeAll(async () => {
    // Create a test user
    const hashedPassword = await brcrypt.hash(testUser.password, 10);
    await User.create({
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword
    });
});

// Clean up test data after tests
afterAll(async () => {
    await User.deleteOne({ email: testUser.email });
});

jest.setTimeout(10000);
jest.retryTimes(3);

// Get auth token for test requests
let authToken;

beforeEach(async () => {
    // Log in and get token before each test
    const res = await request(app)
        .post('/api/users/login')
        .send({
            email: testUser.email,
            password: testUser.password
        });
    authToken = res.body.token;
});

describe('Route /api/users', () => {
    describe('POST /api/users/login', () => {
        test('should return authorization token', done => {
            const user = {
                email: testUser.email,
                password: testUser.password
            };

            request(app)
                .post('/api/users/login')
                .send(user)
                .expect(200)
                .expect(res => {
                    expect(res.body.success).toBeTruthy();
                    expect(res.body.token).toBeTruthy();
                })
                .end(done);
        });

        test('should return 404 if user not found', done => {
            const user = {
                email: 'does_not_exists@gmail.com',
                password: 'password'
            };

            request(app)
                .post('/api/users/login')
                .send(user)
                .expect(404)
                .end(done);
        });
    });

    describe('POST /api/users/register', () => {
        test('should not register the user if already exist', done => {
            const user = {
                email: 'mp.pathela@gmail.virginmojito',
                password: 'password',
                password2: 'password',
                name: 'Mayank'
            };

            request(app)
                .post('/api/users/register')
                .send(user)
                .expect(400)
                .expect(res => {
                    expect(res.body.name).toBeFalsy();
                })
                .end(done);
        });
    });
});

describe('Route /api/student', () => {
    describe('GET /api/student/all', () => {
        test('Get all the student details', done => {
            request(app)
                .get('/api/student/all')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .expect(res => {
                    expect(res.body).toBeTruthy();
                })
                .end(done);
        });
    });

    describe('POST /api/student', () => {
        test('should create a new student record', done => {
            request(app)
                .post('/api/student')
                .set('Authorization', `Bearer ${authToken}`)
                .send(testStudent)
                .expect(200)
                .expect(res => {
                    expect(res.body.success).toBeTruthy();
                    expect(res.body.student).toBeTruthy();
                    expect(res.body.student.name).toBe(testStudent.name);
                    expect(res.body.student.email).toBe(testStudent.email);
                })
                .end(done);
        });

        test('should return 400 if required fields are missing', done => {
            const invalidStudent = { ...testStudent };
            delete invalidStudent.name; // Remove required field
            
            request(app)
                .post('/api/student')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidStudent)
                .expect(400)
                .end(done);
        });

        test('should return 400 if email is invalid', done => {
            const invalidStudent = {
                ...testStudent,
                email: 'invalid-email' // Invalid email format
            };
            
            request(app)
                .post('/api/student')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidStudent)
                .expect(400)
                .end(done);
        });
    });
});