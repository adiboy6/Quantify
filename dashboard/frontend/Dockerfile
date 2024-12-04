# Step 1: Build the Vite React app
FROM node:18-alpine AS builder

WORKDIR /app

# Pass the environment variable to Vite build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Copy the package manager's configuration and install dependencies
COPY frontend/package.json ./
RUN npm install -g pnpm && pnpm install && pnpm list --depth 0
RUN ls -la /app/node_modules/vite

# Copy the entire frontend source code
COPY frontend ./

# Build the app for production
RUN pnpm run build

# Step 2: Serve the app using nginx
FROM nginx:alpine

# Copy the built app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Add custom nginx configuration if needed
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the default HTTP port
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
