FROM node:22-alpine AS compile
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . . 
RUN npm run compile

FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=compile /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]
