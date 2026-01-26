# Firebase Migration Plan

To deploy your Health App to Firebase, we need to adapt the application because Firebase operates differently from a local server.

## 1. Database Migration (Progressing)
**Current:** Local SQLite file (`database.sqlite`).
**Solution:** Migrate to **Cloud Firestore**.
- [x] Create `server/firebase-config.js` to initialize Firebase Admin.
- [x] Create `server/database.js` to prototype Firestore logic.
- [x] Migrate all Sequelize models to Firestore equivalents.
- [x] Update all routes (`hospitals.js`, `doctors.js`, `medicines.js`, `appointments.js`, `vitals.js`, `orders.js`) to use Firestore.
- [x] Created Firestore Seeding script (`server/scripts/seed-firestore.js`).

## 2. Real-time Features
**Current:** Socket.io.
**Progress:** Foundations for Socket.io are in place, but Firestore Realtime Listeners are planned for the finalized cloud version.
- [ ] Implementation of Firestore Listeners for Chat.

## 3. AI Triage Chatbot (Implemented)
**Goal:** Automated symptom checking and triage.
- [x] Integrate OpenAI API for triage.
- [x] Implement "Smart Demo Mode" fallback.
- [x] Add AI Assistant FAB to frontend.

## 4. Environment Stabilization
- [x] Google OAuth functional with local callbacks.
- [ ] Update callbacks for Firebase Hosting domain.

## user Action Items
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Enable **Firestore Database**.
4. Enable **Authentication** (Google & Email/Password).
5. Get the **Service Account Key** (for Server).
6. Get the **Web App Config** (for Client/Frontend) from Project Settings > General > Your apps.
     as `