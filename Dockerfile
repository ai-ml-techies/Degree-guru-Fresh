# ── Base Stage ─────────────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci || npm install

# ── Development Stage ──────────────────────────────────────────────────
FROM base AS dev
WORKDIR /app
COPY . .
EXPOSE 8080
CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "8080"]

# ── Build Stage ────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY . .
RUN npm run build

# ── Production Stage (Nginx) ───────────────────────────────────────────
FROM nginx:alpine AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
