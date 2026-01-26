const express = require('express');
const passport = require('passport');
const router = express.Router();
const { getUserByEmail, createUser, verifyPassword } = require('../database');
const { validateLogin } = require('../middleware/validation');

// GET signup
router.get('/signup', (req, res) => {
  res.render('login', { error: null, user: null, isSignup: true });
});

// POST signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.render('login', { error: 'Email already registered', user: null, isSignup: true });
    }

    // Create user
    const user = await createUser({
      name,
      email,
      password,
      role: 'patient',
      provider: 'email'
    });

    // Log the user in
    req.login(user, (err) => {
      if (err) return res.render('login', { error: 'Auto-login failed. Please try logging in manually.', user: null });
      res.redirect('/dashboard');
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.render('login', { error: 'Registration failed: ' + error.message, user: null, isSignup: true });
  }
});

// POST login - Traditional email/password login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Check if user exists
    const user = await getUserByEmail(email);

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).render('login', { error: 'Invalid email or password', user: null, isSignup: false });
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      console.log('Invalid password for:', email);
      return res.status(401).render('login', { error: 'Invalid email or password', user: null, isSignup: false });
    }

    // Create session
    req.login(user, (err) => {
      if (err) {
        console.error('Login session error:', err);
        return res.status(500).render('login', { error: 'Session error', user: null, isSignup: false });
      }
      console.log('Login successful for:', email);
      return res.redirect('/dashboard');
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).render('login', { error: 'Server error: ' + error.message, user: null, isSignup: false });
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
router.get('/google', (req, res, next) => {
  console.log('Initiating Google Login...');
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
});


router.get('/google/callback', (req, res, next) => {
  console.log('Google callback received, authenticating...');
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.error('Google OAuth Authentication Error:', err);
      console.error('Error Stack:', err.stack);
      const errorMsg = err.message === 'Unauthorized' || err.status === 401
        ? 'Invalid Google Credentials. Please check client secret.'
        : 'Login failed: ' + err.message;
      return res.render('login', { error: errorMsg, user: null });
    }

    if (!user) {
      console.warn('Google Auth success but No User returned. Info:', info);
      return res.redirect('/login');
    }

    console.log('Google Auth success for user:', user.email);
    req.logIn(user, (err) => {
      if (err) {
        console.error('Passport logIn error:', err);
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
