# Google OAuth Integration Guide

## 🔐 Setup Google OAuth for Smart Health Connect

This guide will help you set up Google Sign-In authentication for your health app.

---

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
- Visit: [https://console.developers.google.com/](https://console.developers.google.com/)
- Sign in with your Google account

### 1.2 Create a New Project
1. Click on the project dropdown at the top
2. Click "NEW PROJECT"
3. Enter project name: "Smart Health Connect"
4. Click "CREATE"
5. Wait for the project to be created (1-2 minutes)

### 1.3 Enable Google+ API
1. Go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it
4. Click "ENABLE"

### 1.4 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. If prompted, click "Configure OAuth consent screen"
4. Fill in the consent screen:
   - **App name:** Smart Health Connect
   - **User support email:** your-email@example.com
   - **Developer contact:** your-email@example.com
   - Click "SAVE AND CONTINUE"
5. Skip scopes and click "SAVE AND CONTINUE"
6. Skip optional info and click "SAVE AND CONTINUE"
7. Back to credentials, click "Create Credentials" → "OAuth 2.0 Client ID"
8. Select "Web application"
9. Add Authorized JavaScript origins:
   ```
   http://localhost:3000
   http://localhost:5000
   ```
10. Add Authorized redirect URIs:
    ```
    http://localhost:3000/auth/google/callback
    http://localhost:5000/auth/google/callback
    ```
11. Click "CREATE"
12. Copy the **Client ID** and **Client Secret**

---

## Step 2: Configure Environment Variables

### 2.1 Update .env file
Open `.env` in your project root and add:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

Replace:
- `your-client-id.apps.googleusercontent.com` with your actual Client ID
- `your-client-secret` with your actual Client Secret

**⚠️ IMPORTANT:** Never commit the actual credentials to version control!

---

## Step 3: Install Dependencies

Already installed! The following packages were added:
- `passport` - Authentication middleware
- `passport-google-oauth20` - Google OAuth strategy

---

## Step 4: How It Works

### Login Flow:
1. User clicks "Continue with Google" button
2. Redirected to Google login page
3. User authenticates with Google
4. Google redirects to `/auth/google/callback`
5. User data is extracted and session created
6. Redirected to `/dashboard`

### Files Involved:
- `server/middleware/passport-config.js` - Google strategy configuration
- `server/routes/auth.js` - OAuth routes and callbacks
- `server/server.js` - Passport initialization
- `server/views/login.ejs` - Google Sign-In button UI

---

## Step 5: Test Google Sign-In

### 5.1 Start your app
```bash
npm start
```

### 5.2 Visit login page
- Go to `http://localhost:3000/login`
- Click "Continue with Google" button
- You should be redirected to Google login
- After authentication, redirected to dashboard

### 5.3 Test with demo account (optional)
If you want to add test users in Google Console:
1. Go to OAuth consent screen
2. Add test user emails
3. These accounts can test the app even if it's in development

---

## Step 6: Production Deployment

### 6.1 Update Environment Variables
When deploying to production:

```env
NODE_ENV=production
GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback
```

### 6.2 Add Production URLs to Google Console
1. Go to Google Cloud Console
2. Add your production domain to:
   - **Authorized JavaScript origins:** `https://yourdomain.com`
   - **Authorized redirect URIs:** `https://yourdomain.com/auth/google/callback`

### 6.3 SSL Certificate
- Ensure your production domain has an SSL certificate (HTTPS)
- Google OAuth requires HTTPS for production

---

## Security Best Practices

✅ **DO:**
- Keep credentials in `.env` file (never commit)
- Use HTTPS in production
- Validate user email before creating account
- Store user info securely
- Use secure session cookies
- Implement CSRF protection

❌ **DON'T:**
- Expose Client Secret in frontend code
- Use HTTP in production
- Store passwords for OAuth users
- Trust client-side validation
- Use simple session secrets

---

## API Endpoints

### Google OAuth Routes:
```
GET  /auth/google              - Initiate Google login
GET  /auth/google/callback     - OAuth callback (internal)
GET  /logout                   - Logout user
```

### Protected Routes:
```
GET  /dashboard                - User dashboard (requires login)
```

---

## Troubleshooting

### Error: "Invalid client"
- Check Client ID and Client Secret in `.env`
- Ensure credentials match those from Google Console

### Error: "Redirect URI mismatch"
- Verify redirect URI in Google Console matches your app URL
- Development: `http://localhost:3000/auth/google/callback`
- Production: `https://yourdomain.com/auth/google/callback`

### User not authenticated
- Clear browser cookies
- Clear session data
- Check if passport-config is loaded
- Verify passport middleware is initialized in server.js

### Can't see Google Sign-In button
- Check browser console for errors
- Verify login.ejs file exists and has Google button
- Clear browser cache and reload

---

## User Data from Google

When a user signs in with Google, you receive:
```javascript
{
  email: "user@example.com",
  name: "John Doe",
  picture: "https://...",
  googleId: "123456789",
  provider: "google"
}
```

This data is used to create/authenticate the user session.

---

## Customization

### Change Button Appearance
Edit the Google button in `server/views/login.ejs`:
- Modify CSS styles
- Change button text
- Add icons

### Store Additional Data
Update `server/middleware/passport-config.js`:
- Store user profile picture
- Save additional info to database
- Link Google account to existing user

### Multiple OAuth Providers
To add other providers (Facebook, GitHub, etc.):
1. Install respective passport strategy
2. Configure strategy in `passport-config.js`
3. Add routes in `auth.js`
4. Add buttons in login page

---

## Database Integration (Future)

To persist Google user accounts:

1. Update database schema to include Google fields:
   ```sql
   ALTER TABLE users ADD COLUMN googleId TEXT;
   ALTER TABLE users ADD COLUMN provider TEXT;
   ALTER TABLE users ADD COLUMN picture TEXT;
   ```

2. Modify `passport-config.js` to insert/update users:
   ```javascript
   // Insert new user to database
   db.run('INSERT INTO users (...) VALUES (...)')
   ```

3. Deserialize user from database:
   ```javascript
   passport.deserializeUser((id, done) => {
     db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
       done(err, user);
     });
   });
   ```

---

## Testing with Different Google Accounts

1. **Use different browsers** - Each browser maintains separate Google session
2. **Use incognito/private mode** - Fresh Google session each time
3. **Add test users** - In Google Console OAuth consent screen
4. **Logout between tests** - Click logout to clear session

---

## Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Documentation](http://www.passportjs.org/)
- [Google Sign-In Guide](https://developers.google.com/identity/sign-in)

---

## Next Steps

1. ✅ Install dependencies (done)
2. ✅ Configure Passport (done)
3. ✅ Add OAuth routes (done)
4. ✅ Update UI with Google button (done)
5. 📝 Get Google OAuth credentials (see Step 1)
6. 📝 Update `.env` with credentials
7. 🚀 Test the login flow
8. 🔧 Store users in database (optional)
9. 📦 Deploy to production

---

**Status:** OAuth infrastructure ready, awaiting credentials configuration

**Last Updated:** January 11, 2026
