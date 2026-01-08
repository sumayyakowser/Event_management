const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { users } = require('../data/store');
const { SECRET } = require('../middleware/auth');
const { v4: uuid } = require('uuid');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  users.push({
    id: uuid(),
    email,
    password: hashed,
    role // organizer or attendee
  });

  res.status(201).json({ message: 'User registered successfully' });
});

router.post('/login', async (req, res) => {
  const user = users.find(u => u.email === req.body.email);
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

module.exports = router;
