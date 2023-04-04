FROM node:16.19.1

WORKDIR /localhost

RUN npm init -y

RUN npm install

COPY . .

CMD ["node","app.js"]