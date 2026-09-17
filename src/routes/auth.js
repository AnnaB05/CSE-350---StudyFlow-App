import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { dbRun, dbGet } from '../config/database.js';

const router = Router();

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

export default router;
