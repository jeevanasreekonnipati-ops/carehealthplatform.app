# 🏥 Smart Health Connect

A comprehensive healthcare management platform that connects patients with hospitals, doctors, and pharmacy services. Built with Node.js, Express, and modern web technologies.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

## Table of Contents

- Features
- Tech Stack
- Quick Start
- Project Structure
- Environment Variables
- Database Setup
- Running Locally
- Testing
- Deployment
- Contributing
- License
- Contact

## Features

- Hospital discovery (Tirupati sample data)
- Doctor directory and appointment scheduling
- AI-powered triage assistant (OpenAI integration; demo mode available)
- Online pharmacy with stock management and prescriptions
- User health dashboard with vitals and appointment history
- Google OAuth + local authentication
- Multi-language (English, Hindi, Telugu)

## Tech Stack

Backend
- Node.js, Express
- Sequelize with SQLite3 (transition planning for Firestore)
- Passport.js (Local + Google)
- EJS for server-side views

Frontend
- Vanilla JavaScript
- CSS (Glassmorphism dark theme)

## Quick Start

Prerequisites
- Node.js >= 14
- npm or yarn

1. Clone the repo

```bash
git clone https://github.com/jeevanasreekonnipati-ops/carehealthplatform.app.git
cd carehealthplatform.app
```

2. Install dependencies

```bash
npm install
# or
# yarn install
```

3. Copy environment example and update

```bash
cp .env.example .env
# then edit .env with your values
```

4. Run migrations / seed (if applicable)

```bash
# The project uses Sequelize with a file-based SQLite DB by default.
# If a migration or seed script is provided, run it here. Otherwise the app will initialize a DB file on first run.
```

5. Start the app

```bash
npm start
# or for development with auto-reload
# npm run dev
```

App will be available at http://localhost:3000 by default.

## Project Structure

- server/ - backend code and routes
- public/ - static assets (CSS, JS, images)
- views/ - EJS templates
- database/ - SQLite files (if used locally)
- README_DEPLOY.md - deployment-specific instructions

## Environment Variables

Copy `.env.example` to `.env` and provide values for at least:

- SESSION_SECRET - session signing secret
- PORT - port to run the server (default 3000)
- DB_PATH - path to SQLite DB file (if used)
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET - for Google OAuth
- OPENAI_API_KEY - optional for AI triage assistant

## Database Setup

This project currently uses Sequelize with SQLite for local development. If you migrate to Firestore or another DB, update `server/config.js` and ORM setup accordingly.

## Running Locally

- Start the dev server: `npm run dev` (if defined) or `npm start`
- Visit `http://localhost:3000`
- Use the Smart Demo Mode for AI features if no OpenAI key is configured

## Testing

If test scripts are present, run them with:

```bash
npm test
```

## Deployment

See README_DEPLOY.md for full deployment instructions. Short summary:

- Docker
  - Build: `docker build -t healthapp:latest .`
  - Run: `docker run -p 3000:3000 --env-file .env healthapp:latest`
- Heroku
  - `heroku create my-healthapp`
  - `git push heroku main`
  - `heroku config:set NODE_ENV=production PORT=3000`

Notes:
- Copy `.env.example` to `.env` and update before deploying
- Ensure `SESSION_SECRET` and any API keys are set in deployment environment

## Contributing

Contributions are welcome. Please open an issue first to discuss major changes. For fixes and small features:

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit changes and push
4. Open a Pull Request describing your changes

## License

This project is licensed under the ISC License. See the LICENSE file for details.

## Contact

If you need help, open an issue or contact the maintainer: jeevanasreekonnipati-ops

---

Notes:
- I updated the README to include a concise Quick Start, environment details, and cross-reference to README_DEPLOY.md. If you want more detail (examples, screenshots, API endpoint list, or contribution templates), tell me what to add and I will update the file.