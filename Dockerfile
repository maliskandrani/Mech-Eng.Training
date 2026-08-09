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

# Applies pending migrations then starts the production server.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start -- -p 3000"]
