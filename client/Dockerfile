FROM node:carbon
WORKDIR /usr/src/childwatch-client
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production
CMD ["npm", "start"]