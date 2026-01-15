const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const config = require("./config");
const authRoutes = require("./routes/auth");
const hospitalRoutes = require("./routes/hospitals");
const { requireAuth, redirectIfLoggedIn } = require("./middleware/auth");
require("./middleware/passport-config");

// Initialize Express App
const app = express();

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files - serve public folder
app.use(express.static(path.join(__dirname, "../public")));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: config.env === "production",
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("index", { user: req.user, googleApiKey: process.env.GOOGLE_API_KEY });
});

app.get("/login", redirectIfLoggedIn, (req, res) => {
  res.render("login", { error: null, user: null });
});

app.get("/dashboard", requireAuth, (req, res) => {
  res.render("dashboard", { user: req.user, googleApiKey: process.env.GOOGLE_API_KEY });
});

app.use("/auth", authRoutes);
app.use("/api/hospitals", hospitalRoutes);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Error clearing session");
      }
      res.redirect("/");
    });
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", {});
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  const status = err.status || 500;
  // If request accepts HTML, render error page
  if (req.accepts('html')) {
    res.status(status).render("500", {
      error: config.env === "production" ? "Internal Server Error" : err.message
    });
  } else {
    // JSON response for API calls
    res.status(status).json({
      error: config.env === "production" ? "Internal Server Error" : err.message,
    });
  }
});

// Start server if run directly
if (require.main === module) {
  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${config.env}`);
  });
}

// Export for Cloud Functions
module.exports = app;
