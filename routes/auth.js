const express = require('express');
const bcrypt = require('bcrypt');
const { isLoggedIn } = require('../middleware/auth.js');

const router = express.Router();

// fetch users from a database or in-memory store
let userUrl  = 'http://localhost:3010/user';
let users = [];
(async () => {
  users = await fetch(userUrl).then(res => res.json());
})();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existingUser = users.find(user => user.USER_ID === username);

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: 'User registered' });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.USER_ID === username);

  if (!user || !(await bcrypt.compare(password, user.PASSWORD))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  req.session.user = { username };
  res.json({ message: 'Logged in' });
});

// // POST /auth/logout
// router.post('/logout', (req, res) => {
//   req.session.destroy(err => {
//     if (err) return res.status(500).json({ message: 'Error logging out' });
//     res.clearCookie('connect.sid');
//     res.json({ message: 'Logged out' });
//   });
// });


module.exports = router;
