const express = require('express');
const passport = require('passport');
const router = express.Router();
const { User } = require('../models');
const { validateLogin, sanitizeEmail } = require('../middleware/validation');

// POST login - Traditional email/password login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Check if user exists (case insensitive)
    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).render('login', { error: 'Invalid email or password', user: null });
    }

    // Verify password
    if (!user.validPassword(password)) {
      console.log('Invalid password for:', email);
      return res.status(401).render('login', { error: 'Invalid email or password', user: null });
    }

    // Create session
    req.login(user, (err) => {
      if (err) {
        console.error('Login session error:', err);
        return res.status(500).render('login', { error: 'Session error', user: null });
      }
      console.log('Login successful for:', email);
      return res.redirect('/dashboard');
    });
  } catch (error) {
    console.error('Login error:', error);
    require('fs').writeFileSync('debug_error.log', JSON.stringify({ message: error.message, stack: error.stack }, null, 2));
    res.status(500).render('login', { error: 'Server error: ' + error.message, user: null });
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
