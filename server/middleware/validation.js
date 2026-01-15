// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

// Password validation (minimum 6 chars, at least one number)
const isValidPassword = (password) => {
  return password && password.length >= 6 && /\d/.test(password);
};

// Sanitize input - remove extra whitespace and trim
const sanitizeEmail = (email) => {
  return email.trim().toLowerCase();
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().substring(0, 255);
};

// Validation middleware
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).render('login', { error: 'Email and password are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).render('login', { error: 'Invalid email format' });
  }

  req.body.email = sanitizeEmail(email);
  next();
};

module.exports = {
  isValidEmail,
  isValidPassword,
  sanitizeEmail,
  sanitizeInput,
  validateLogin,
};
