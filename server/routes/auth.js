const express = require('express');
const passport = require('passport');
const router = express.Router();
const { getUserByEmail, verifyPassword } = require('../database');
const { validateLogin, sanitizeEmail } = require('../middleware/validation');

// POST login - Traditional email/password login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).render('login', { error: 'Invalid email or password', user: null });
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      return res.status(401).render('login', { error: 'Invalid email or password', user: null });
    }

    // Create session
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).render('login', { error: 'Server error. Please try again.', user: null });
  }
});

// GET logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

// Google OAuth Routes
// Initiate Google login
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// Google OAuth callback
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.error('Google OAuth Error:', err);
      // If the error is due to invalid credentials (Unauthorized), show a specific message
      const errorMsg = err.message === 'Unauthorized' || err.status === 401
        ? 'Invalid Google Credentials. Please check client secret.'
        : 'Login failed. Please try again.';
      return res.render('login', { error: errorMsg, user: null });
    }

    if (!user) {
      return res.redirect('/login');
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});

// POST logout (legacy support)
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

module.exports = router;
