FROM node:22-alpine 
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npx tsc

EXPOSE 3000
CMD ["node", "dist/server.js"]
