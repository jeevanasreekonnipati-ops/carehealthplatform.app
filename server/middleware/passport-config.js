const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { getUserByEmail, getUserById, getUserByGoogleId, createGoogleUser } = require('../database');

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
    const { email, name, picture, id: googleId } = profile._json;
    
    // Check if user exists by Google ID first
    let user = await getUserByGoogleId(googleId);
    
    if (!user) {
      // Check if email already exists (from email/password signup)
      user = await getUserByEmail(email);
      
      if (!user) {
        // Create new user with Google data
        user = await createGoogleUser({ email, name, picture, id: googleId });
        console.log('New Google user created:', email);
      } else {
        // Link Google account to existing email user
        console.log('Linking Google account to existing user:', email);
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
