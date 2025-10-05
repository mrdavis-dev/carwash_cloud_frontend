# Multi-stage Dockerfile for a Vite + Vue app
# Stage 1: build
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install --silent

# Copy source
COPY . .

# Build
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:stable-alpine AS production
# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (optional)
# If you want to use a custom nginx.conf, add it and uncomment the next line
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
