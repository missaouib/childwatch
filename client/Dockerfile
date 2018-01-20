FROM node:carbon
WORKDIR /usr/src/childwatch-client
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]