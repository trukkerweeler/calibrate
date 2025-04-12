import express from 'express';
import bcrypt from 'bcrypt';
import { isLoggedIn } from '../middleware/auth.js';
import { getUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/users', async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  req.session.user = { username };
  res.json({ message: 'Logged in' });
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

// Check login status
router.get('/status', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// Example protected route
router.get('/profile', isLoggedIn, (req, res) => {
  res.json({ message: `Hello, ${req.session.user.username}` });
});

export default router;