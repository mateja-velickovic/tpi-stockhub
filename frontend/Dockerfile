FROM node:22-alpine AS production            
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Staging
FROM nginx:alpine AS staging
COPY --from=production /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf