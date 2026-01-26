# 🚀 Quick Deployment Guide (Render)

Follow these steps to put your **Smart Health Connect** app online in less than 5 minutes.

## 1. Prepare your GitHub
Ensure your latest code is pushed:
```bash
git add .
git commit -m "Final deployment prep"
git push origin main
```

## 2. Setup Render.com
1.  Go to [Dashboard.Render.com](https://dashboard.render.com/) and Login with GitHub.
2.  Click **New +** > **Web Service**.
3.  Select your repository: `carehealthplatform.app`.

## 3. Configuration
- **Name**: `carehealthplatform`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

## 4. Environment Variables (CRITICAL)
Click **Advanced** > **Add Environment Variable**. Add these from your `.env`:
| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | (Something random and long) |
| `OPENAI_API_KEY` | (Your AI Key) |
| `GOOGLE_CLIENT_ID` | (Your Google ID) |
| `GOOGLE_CLIENT_SECRET` | (Your Google Secret) |
| `GOOGLE_CALLBACK_URL` | `https://your-app-name.onrender.com/auth/google/callback` |

## 5. Secret Files (For Firebase)
If you want to use the Cloud Database (Firestore) on the live site:
1.  Go to the **Secret Files** tab in Render.
2.  Click **Add Secret File**.
3.  **Filename**: `serviceAccountKey.json`
4.  **Contents**: Paste the entire contents of your `serviceAccountKey.json` here.

## 6. Update Google Console
1.  Go to [Google Cloud Console](https://console.developers.google.com/).
2.  Go to **APIs & Services > Credentials**.
3.  Edit your OAuth 2.0 Client ID.
4.  Add `https://your-app-name.onrender.com/auth/google/callback` to **Authorized redirect URIs**.

---

### 🎉 Your app is now live!
Render will give you a link like `https://carehealthplatform.onrender.com`. Share this with your users!
