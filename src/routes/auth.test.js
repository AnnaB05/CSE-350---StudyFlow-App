import request from 'supertest';
import app from '../app.js';
import { dbRun, initializeDatabaseSchema } from '../config/database.js';

describe('Unit Tests', () => {
    //this should allow us to generate a random email for each test run to avoid conflicts with existing db records
    //should also allow us to run tests at the same time without dealing with conflicts in the db
  const dynamicTestEmail = `student_${Date.now()}@louisville.edu`;
  const dynamicTestPassword = 'password9876!';
  let globallyTrackedUserId = null;
  let globallyTrackedTaskId = null;

  //setup the db schema before running the tests so they dont fail due to missing tables/columns
  //should also make sure that the studyflow.db file is created in case anyone forgets to run npm start before adding and testing code
  beforeAll(async () => {
    await initializeDatabaseSchema();
  });

  //cleans up test data after the suite executes to keep the fake emails/pws out of our actual db 
  afterAll(async () => {
    try {
      await dbRun('DELETE FROM users WHERE email = ?', [dynamicTestEmail]);
    } catch (err) {
      console.error('Test cleanup hook skipped:', err);
    }
  });


  describe('USER AUTHENTICATION TESTS', () => {
    
    //checks if the registration succeeds when a new email is used
    it('SUCCESS: Should create a new user profile with hashed credentials', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: dynamicTestEmail, password: dynamicTestPassword });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
    });

    //checks if the registration fails when a duplicate email is used again
    it('FAIL: Should reject duplicate registration matching an existing identity record', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: dynamicTestEmail, password: dynamicTestPassword });

      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty('error');
    });

    //checks if the login succeeds when the correct credentials are provided
    it('SUCCESS: Should verify credentials and pass login authorization', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: dynamicTestEmail, password: dynamicTestPassword });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty('id');
      
      //capture the ID dynamically to use in the upcoming task tests
      globallyTrackedUserId = res.body.user.id;
    });

    //checks if the login fails when the incorrect credentials are provided
    it('FAIL: Should block login attempts containing incorrect text keys', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: dynamicTestEmail, password: 'WrongPasswordXYZ' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

 

  describe('TASK CHECKLIST TESTS', () => {

    //checks if we can add a new task for the user
    it('SUCCESS: Should add a new task row to the database linked to the user', async () => {
      const res = await request(app)
        .post('/api/auth/tasks')
        .send({ userId: globallyTrackedUserId, title: 'Complete CSC-350 Deliverables' });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
    });

    //checks if we can retrieve the task list
    it('SUCCESS: Should fetch a clean array of checklist items for a specific profile', async () => {
      const res = await request(app).get(`/api/auth/tasks/${globallyTrackedUserId}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].title).toBe('Complete CSC-350 Deliverables');
      
      //capture the task ID dynamically to update and delete it next
      globallyTrackedTaskId = res.body[0].id;
    });

    //checks if we can update the task completion status
    it('SUCCESS: Should modify the checkmark completion flag inside database rows', async () => {
      const res = await request(app)
        .put(`/api/auth/tasks/${globallyTrackedTaskId}`)
        .send({ isCompleted: 1 }); //sets task state to true

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    //checks if we can delete the task
    it('SUCCESS: Should cleanly delete a designated task record item', async () => {
      const res = await request(app).delete(`/api/auth/tasks/${globallyTrackedTaskId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
