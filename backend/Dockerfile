FROM node:22-alpine 
WORKDIR /app
ENV NODE_ENV=production
COPY . .
RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "src/server.ts"]
