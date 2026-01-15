FROM node:18-alpine

WORKDIR /app

# Install deps (use package-lock for reproducible installs)
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy app
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server/server.js"]
