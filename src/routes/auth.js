import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { dbRun, dbGet, dbAll } from '../config/database.js'; // Added dbAll to fix runtime reference errors

const router = Router();

//==========================
// AUTHENTICATION ENDPOINTS
//==========================

// POST Route /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password } = req.req_body || req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing mandatory email or password parameter strings.' });
  }

  try {
    //check for existing user accout with same email
    const accountLookup = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (accountLookup) {
      return res.status(409).json({ error: 'Target identity record matches an existing account instance.' });
    }

    //hash raw text password using standard computing safety thresholds
    const SALT_ROUNDS = 10;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    //save user in the sqlite layer
    await dbRun(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, passwordHash]
    );
    return res.status(201).json({ success: true, message: 'User database entry initialized successfully.' });
  } catch (err) {
    console.error('SYSTEM BREAKDOWN: Route handler /register crashed:', err);
    return res.status(500).json({ error: 'Internal server error processing identity pipeline.' });
  }
});

//POST route /api/auth/login to validate user credentials and return a success response
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing mandatory email or password parameter strings.' });
  }

  try {
    //look up user by email
    const user = await dbGet('SELECT id, email, password_hash FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials provided.' });
    }

    //compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials provided.' });
    }
    //on sucessful match, return user id/email without exposing password hash
    return res.status(200).json({ 
      success: true, 
      message: 'Login verification passed.',
      user: { id: user.id, email: user.email } 
    });
  } catch (err) {
    console.error('SYSTEM BREAKDOWN: Route handler /login crashed:', err);
    return res.status(500).json({ error: 'Internal server error processing login verification.' });
  }
});

//============================
//TASK PLANNER CRUD ENDPOINTS
//============================

//GET route: /api/auth/tasks/:userId to retrieve all checklist items for a specific user
router.get('/tasks/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const tasks = await dbAll('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return res.status(200).json(tasks);
  } catch (err) {
    console.error('SYSTEM BREAKDOWN: Fetch tasks routine crashed:', err);
    return res.status(500).json({ error: 'Failed to retrieve task checklist sets from database.' });
  }
});

//POST route: /api/auth/tasks to create a new checklist item for a user
router.post('/tasks', async (req, res) => {
  const { userId, title } = req.body;

  if (!userId || !title) {
    return res.status(400).json({ error: 'Missing required userId or task title text parameters.' });
  }

  try {
    await dbRun('INSERT INTO tasks (user_id, title) VALUES (?, ?)', [userId, title]);
    return res.status(201).json({ success: true, message: 'New task registered successfully.' });
  } catch (err) {
    console.error('SYSTEM BREAKDOWN: Create task routine crashed:', err);
    return res.status(500).json({ error: 'Failed to append task item entry.' });
  }
});

//PUT route: /api/auth/tasks/:taskId to update a specific checklist item
router.put('/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { isCompleted } = req.body; // Expects 0 (false) or 1 (true)

  if (isCompleted === undefined) {
    return res.status(400).json({ error: 'Missing required isCompleted parameter integer.' });
  }

  try {
    // Update the checkmark status inside the localized database row
    await dbRun('UPDATE tasks SET is_completed = ? WHERE id = ?', [isCompleted, taskId]);
    return res.status(200).json({ success: true, message: 'Task compilation status updated successfully.' });
  } catch (err) {
    console.error('SYSTEM BREAKDOWN: Update task routine crashed:', err);
    return res.status(500).json({ error: 'Failed to modify task completion profile status.' });
  }
});

//DELETE route: /api/auth/tasks/:taskId to remove a specific checklist item
router.delete('/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;

  try {
    await dbRun('DELETE FROM tasks WHERE id = ?', [taskId]);
    return res.status(200).json({ success: true, message: 'Task record purged successfully.' });
  } catch (err) {
    console.error('SYSTEM BREAKDOWN: Delete task routine crashed:', err);
    return res.status(500).json({ error: 'Failed to clear task record item.' });
  }
});

export default router;
