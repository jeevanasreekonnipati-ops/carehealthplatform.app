# Firebase Migration Plan

To deploy your Health App to Firebase, we need to adapt the application because Firebase operates differently from a local server.

## 1. Database Migration (Critical)
**Current:** Local SQLite file (`database.db`).
**Issue:** On Firebase (and most cloud platforms), the file system is temporary. Your database would be reset every time the server restarts.
**Solution:** Migrate to **Cloud Firestore** (Firebase's NoSQL database).
- [ ] Create `server/firebase-config.js` to initialize Firebase Admin.
- [ ] Rewrite `server/database.js` to use Firestore instead of SQLite.
- [ ] Update data queries in `auth.js` and `hospitals.js`.

## 2. Real-time Features
**Current:** Socket.io.
**Issue:** Socket.io requires a persistent server. Firebase Functions spin up and down on demand.
**Solution:** Use **Firestore Realtime Listeners** or **Firebase Realtime Database**.
- [ ] Remove Socket.io from server.
- [ ] Update client-side chat to listen to a `messages` collection in Firestore.

## 3. Backend Deployment
**Current:** Node.js Express Server.
**Solution:** **Firebase Cloud Functions**.
- [ ] Wrap the Express app in `functions.https.onRequest`.
- [ ] Ensure `views` (EJS) are handled correctly or move to a client-side framework (optional, but EJS via functions works).

## 4. Static Hosting
**Current:** `public` folder.
**Solution:** **Firebase Hosting**.
- [ ] Configure `firebase.json` to serve static files and rewrite API calls to the Cloud Function.

## user Action Items
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Enable **Firestore Database**.
4. Enable **Authentication** (Google & Email/Password).
5. Get the **Service Account Key** (later).
