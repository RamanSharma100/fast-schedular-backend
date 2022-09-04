FROM node:latest-alpine

WORKDIR /app

COPY package.json .
RUN yarn
COPY . .

CMD ["node", "server.js"]