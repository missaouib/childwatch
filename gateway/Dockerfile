FROM node:alpine
WORKDIR /usr/src/gateway
COPY package.json .
RUN npm install
COPY server.js .
COPY . .
EXPOSE 3000
ENV PGHOST=postgres PGUSER=cw-db PGDATABASE=cw-gateway PGPASSWORD=childwatch
CMD ["npm", "start"]