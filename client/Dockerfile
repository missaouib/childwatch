FROM node:alpine
WORKDIR /usr/src/childwatch-client
COPY package.json .
RUN npm install
COPY server.js .
COPY . .
RUN npm run build-prod
CMD ["npm", "start"]