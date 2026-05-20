FROM node:22-alpine AS build            
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

EXPOSE 5173
CMD ["npm", "run", "server", "--", "--host", "0.0.0.0", "--port", "5173"]