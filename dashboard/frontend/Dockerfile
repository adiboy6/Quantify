# Step 1: Build the Vite React app
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# # Pass the environment variable to Vite build
# ARG VITE_API_URL
# ENV VITE_API_URL=${VITE_API_URL}

# Copy the package manager's configuration and install dependencies
COPY package.json .
RUN npm install -g pnpm && pnpm install && pnpm list --depth 0
# RUN ls -la /app/node_modules/vite

# Copy the entire frontend source code
COPY . .

# Build the app for production
RUN pnpm run build

# Step 2: Serve the app using nginx
FROM nginx:stable-alpine as production

# copy nginx configuration in side conf.d folder
COPY --from=builder /usr/src/app/nginx /etc/nginx/conf.d

# Copy the build output from the dist folder into the Nginx html directory
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

# Expose the default HTTP port
EXPOSE 80

# Run nginx
# CMD ["nginx", "-g", "daemon off;"]

# COPY sshd_config /etc/ssh/
# COPY entrypoint.sh ./

# # Start and enable SSH
# RUN apk add openssh \
#     && echo "root:Docker!" | chpasswd \
#     && chmod +x ./entrypoint.sh \
#     && cd /etc/ssh/ \
#     && ssh-keygen -A

# EXPOSE 8000 2222

# CMD [ "./entrypoint.sh" ]