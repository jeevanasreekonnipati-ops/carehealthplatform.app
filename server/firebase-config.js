const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

let serviceAccount;

try {
    // try to find the service account key
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        // If env var is set, let the SDK handle it or load it if it's a path
        // But usually admin.initializeApp() with no args picks up GOOGLE_APPLICATION_CREDENTIALS automatically.
    } else {
        // Check for local file
        const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
        serviceAccount = require(serviceAccountPath);
    }
} catch (e) {
    console.log('No serviceAccountKey.json found or invalid. Using default credentials if available.');
}

const firebaseConfig = {
    credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault()
};

// Initialize only once
if (!admin.apps.length) {
    try {
        admin.initializeApp(firebaseConfig);
        console.log('Firebase Admin Initialized');
    } catch (error) {
        console.error('Firebase Initialization Error:', error);
    }
}

const db = admin.firestore();

module.exports = { admin, db };
