# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

ENV NODE_ENV=production
ARG VITE_API_BASE_URL
ARG VITE_TELEGRAM_BOT_USERNAME
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_TELEGRAM_BOT_USERNAME=$VITE_TELEGRAM_BOT_USERNAME

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY . .
RUN npm run build

# Serve stage: nginx or simple static server
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
RUN echo 'server { listen 8080; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
