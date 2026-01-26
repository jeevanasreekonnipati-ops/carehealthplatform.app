const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

let serviceAccount;

try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Support passing the service account JSON as a string (useful for Vercel/Render)
        try {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } catch (parseError) {
            console.error('FIREBASE_SERVICE_ACCOUNT JSON Parse Error:', parseError.message);
        }
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        // If env var is set, let the SDK handle it
    } else {
        // Check for local file
        const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
        serviceAccount = require(serviceAccountPath);
    }
} catch (e) {
    console.log('Service account key loading note: Using default credentials or environment variables.');
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
