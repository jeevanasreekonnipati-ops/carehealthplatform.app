// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).redirect('/login');
  }
  next();
};

// Middleware to check if already logged in (redirect to dashboard)
const redirectIfLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  next();
};

module.exports = { requireAuth, redirectIfLoggedIn };
