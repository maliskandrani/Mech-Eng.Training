FROM node:22-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

RUN mkdir -p storage/uploads public/media
EXPOSE 3000
ENV PORT=3000
# Absolute path avoids a known Prisma quirk where a relative sqlite "file:./dev.db"
# path resolves differently for the CLI (migrate/seed) than for the app at runtime.
# Override via .env.production to point at Postgres instead for real production use.
ENV DATABASE_URL="file:/app/prisma/dev.db"

# Applies pending migrations then starts the production server.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start -- -p 3000"]
