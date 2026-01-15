# Firebase Setup & Deployment Instructions

Your application code has been refactored to support Firebase!
- **Database**: Now uses **Firestore** (Cloud Database).
- **Server**: logic adjusted for **Cloud Functions**.
- **Chat**: Socket.io removed (needs Client-side Firestore implementation).

## Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project (e.g., "health-app-v1").
3. Enable **Firestore Database** (Start in Test Mode for development).
4. Enable **Authentication** (Google & Email/Password providers).

## Step 2: Local Development Setup
1. In Firebase Console, go to **Project Settings** > **Service Accounts**.
2. Click **Generate new private key**.
3. Save the file as `serviceAccountKey.json` inside the `healthapp` folder (root).
   - *Note: Our code looks for it in `../serviceAccountKey.json` relative to `server/`, so root is correct.*

## Step 3: Install Firebase CLI
Run this in your terminal:
```bash
npm install -g firebase-tools
firebase login
```

## Step 4: Initialize Firebase
Run:
```bash
firebase init
```
- SELECT: **Firestore**, **Functions**, **Hosting**.
- **Firestore**: Accept defaults (it creates `firestore.rules`).
- **Functions**: 
  - Language: **JavaScript**
  - ESLint: **No**
  - Install dependencies: **Yes**
- **Hosting**:
  - Public directory: `public`
  - Configure as single-page app? **No** (we have multiple HTML pages)
  - Overwrite index.html? **NO** (Keep your existing one)

## Step 5: Connect Express to Functions
After initialization, a `functions` folder will be created.
1. Open `functions/index.js`.
2. Replace its content with:
   ```javascript
   const functions = require("firebase-functions");
   const app = require("../server/server"); // Import your Express app

   // Expose the Express app as a Cloud Function called "api"
   exports.app = functions.https.onRequest(app);
   ```
3. Open `firebase.json` and update the `hosting` section to rewrite URLs to the function:
   ```json
   "hosting": {
     "public": "public",
     "rewrites": [
       {
         "source": "**",
         "function": "app"
       }
     ]
   }
   ```

## Step 6: Deploy
```bash
firebase deploy
```

## Step 7: Restore Chat (Future Task)
The real-time chat previously used Socket.io. You now need to use the Firebase JS SDK in `public/app.js` and your HTML files to connect to Firestore directly from the browser.
