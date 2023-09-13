FROM node:latest

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 8082

CMD ["npm", "start"]
