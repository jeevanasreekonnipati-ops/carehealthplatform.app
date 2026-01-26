const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { getUserById, getUserByGoogleId, getUserByEmail, createUser, updateUser } = require('../database');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
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
      const { email, name, picture } = profile._json;
      const googleId = profile.id;

      // Check if user exists by Google ID
      let user = await getUserByGoogleId(googleId);

      if (!user) {
        // Check if email already exists
        user = await getUserByEmail(email);

        if (user) {
          // Link Google account to existing user
          user = await updateUser(user.id, {
            googleId,
            photo: picture // Assuming 'photo' field in Firestore
          });
        } else {
          // Create new user
          user = await createUser({
            email,
            name: name || 'User',
            photo: picture,
            googleId,
            role: 'patient',
            provider: 'google'
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
