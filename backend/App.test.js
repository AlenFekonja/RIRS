const dotenv = require('dotenv');
const mysql = require('mysql2');

dotenv.config();
//test
test('should have all required environment variables defined', () => {
    const requiredEnvVars = [
        'DB_HOST',
        'DB_USER',
        'DB_PASSWORD',
        'DB_NAME',
        'PORT',
    ];

    requiredEnvVars.forEach((envVar) => {
        expect(process.env[envVar]).toBeDefined();
    });
});

const createDbConnection = () => {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.PORT,
    });
};

test('should connect to the database successfully', (done) => {
    const db = createDbConnection();

    db.connect((err) => {
        expect(err).toBeNull();
        db.end();
        done();
    });
});

const request = require('supertest');
const app = require('./server'); 

test('should respond to GET /api/users and /api/requests', async () => {
    const usersResponse = await request(app).get('/api/users');
    expect(usersResponse.status).not.toBe(404);
    
    const requestsResponse = await request(app).get('/api/requests');
    expect(requestsResponse.status).not.toBe(404);
});

test('should return error when no token is provided for protected routes', async () => {
    const response = await request(app).get('/api/users/loggedIn');
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Token is required');
});

test('should return error for invalid login credentials', async () => {
    const invalidCredentials = {
        user: {
            email: 'invalid@example.com',
            geslo: 'wrongpassword',
        },
    };

    const response = await request(app).post('/api/users/login').send(invalidCredentials);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User does not exist');
});

test('should not register a new user when email exists', async () => { 
    const user = {
        ime: 'John',
        priimek: 'Doe',
        email: 'john.doe13213213@gmail.com',
        geslo: 'Password123'
    };
    const response = await request(app).post('/api/users').send({user});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists');
  });


test('should return all users from the database', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
});

test('should update the request status successfully', async () => {
    const requestData = {
        id: 1,
        status: 'Accepted',
    };

    const response = await request(app).put('/api/requests').send(requestData);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Request status updated successfully');
});

test('should return error when requesting leave requests for a user without token in header', async () => {
     const response = await request(app)
        .get('/api/requests/user-requests')

    expect(response.status).toBe(403);
    expect(Array.isArray(response.body)).toBe(false);
});

test('should retrieve leave statistics by user', async () => {
    const response = await request(app).get('/api/requests/user-request-statuses');
    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('ime');
    expect(response.body[0]).toHaveProperty('priimek');
    expect(response.body[0]).toHaveProperty('odobreniDopusti');
});
const db = require('./db');

afterAll((done) => {

    db.end((err) => {
        if (err) {
            console.error('Error closing the MySQL connection:', err);
            done(err);
        } else {
            console.log('MySQL connection closed');
            done();
        }
    });

});


