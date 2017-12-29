FROM node:latest
WORKDIR /usr/src/childwatch-client
COPY package.json .
RUN npm install
COPY server.js .
COPY . .
RUN npm run build
RUN rm -rf /usr/src/childwatch-client/src
CMD ["npm", "start"]