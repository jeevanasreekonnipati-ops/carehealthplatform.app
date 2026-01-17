const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Configure Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Extract user info from Google profile
      const { email, name, picture, id: googleId } = profile._json;

      // Check if user exists by Google ID
      let user = await User.findOne({ where: { googleId } });

      if (!user) {
        // Check if email already exists
        user = await User.findOne({ where: { email } });

        if (user) {
          // Link Google account to existing user
          user.googleId = googleId;
          if (!user.photo) user.photo = picture;
          await user.save();
        } else {
          // Create new user
          user = await User.create({
            email,
            name: name || 'User',
            photo: picture,
            googleId,
            role: 'patient'
          });
        }
      }

      return done(null, user);
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, null);
    }
  }
));

module.exports = passport;
