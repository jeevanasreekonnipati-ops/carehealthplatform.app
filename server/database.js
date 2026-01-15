const { db } = require('./firebase-config');
const bcrypt = require('bcryptjs');

// Collection reference
const usersRef = db.collection('users');

// Helper to format Firestore doc
const formatUser = (doc) => {
  if (!doc.exists) return null;
  const data = doc.data();
  return { id: doc.id, ...data };
};

// Initialize database (Create demo user if not exists)
const initDB = async () => {
  try {
    const demoEmail = 'user@example.com';
    const snapshot = await usersRef.where('email', '==', demoEmail).limit(1).get();

    if (snapshot.empty) {
      const demoPassword = bcrypt.hashSync('1234', 10);
      await usersRef.add({
        email: demoEmail,
        password: demoPassword,
        name: 'Demo User',
        provider: 'email',
        created_at: new Date()
      });
      console.log('Demo user created in Firestore');
    }
  } catch (error) {
    console.error('Error initializing DB:', error);
  }
};

// Get user by email
const getUserByEmail = async (email) => {
  try {
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();
    if (snapshot.empty) return null;
    return formatUser(snapshot.docs[0]);
  } catch (error) {
    throw error;
  }
};

// Verify password
const verifyPassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

// Hash password
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// Get user by ID
const getUserById = async (id) => {
  try {
    const doc = await usersRef.doc(id).get();
    return formatUser(doc);
  } catch (error) {
    throw error;
  }
};

// Get user by Google ID
const getUserByGoogleId = async (googleId) => {
  try {
    const snapshot = await usersRef.where('googleId', '==', googleId).limit(1).get();
    if (snapshot.empty) return null;
    return formatUser(snapshot.docs[0]);
  } catch (error) {
    throw error;
  }
};

// Create user from Google OAuth
const createGoogleUser = async (googleProfile) => {
  try {
    const { email, name, picture, id: googleId } = googleProfile;

    const newUser = {
      email,
      name: name || 'User',
      picture: picture || null,
      googleId,
      provider: 'google',
      created_at: new Date()
    };

    const docRef = await usersRef.add(newUser);
    const doc = await docRef.get();
    return formatUser(doc);
  } catch (error) {
    throw error;
  }
};

// Initialize
initDB();

module.exports = {
  getUserByEmail,
  getUserById,
  getUserByGoogleId,
  createGoogleUser,
  verifyPassword,
  hashPassword,
};
