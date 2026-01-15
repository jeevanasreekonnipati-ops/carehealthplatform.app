Deployment instructions

Docker (build & run locally):

```bash
# build image
docker build -t healthapp:latest .

# run container (expose port 3000)
docker run -p 3000:3000 --env-file .env.example healthapp:latest
```

Heroku (using Procfile):

```bash
heroku create my-healthapp
git push heroku main
heroku config:set NODE_ENV=production PORT=3000
heroku logs --tail
```

Render / Railway / other platforms:
- Use the Dockerfile or point the platform to this repo.
- Set env vars: `SESSION_SECRET`, `DB_PATH`, `PORT` (if required).

Notes:
- Copy `.env.example` to `.env` and update values before deploying.
- The app reads env from `server/config.js` via `dotenv`.
