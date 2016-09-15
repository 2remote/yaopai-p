FROM node:4.5.0-wheezy

WORKDIR /app

RUN npm install -g forever

COPY ./package.json /app/

RUN npm install

COPY . /app/

RUN npm run build

RUN ls

CMD node yaopai-node/index.js
