FROM node:latest

WORKDIR /app

COPY package.json /app

RUN npm install

RUN npm install axios

COPY . /app

EXPOSE 8083

CMD ["node", "app.js"]
