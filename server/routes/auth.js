const express = require('express');
const router = express.Router();

// Demo user; replace with DB later
const demoUser = { email: 'user@example.com', password: '1234', name: 'Demo User' };

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === demoUser.email && password === demoUser.password) {
    req.session.user = { email, name: demoUser.name };
    return res.redirect('/dashboard');
  }
  return res.render('login', { error: 'Invalid credentials' });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
