FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000
EXPOSE 4200

CMD ["node", "src/app.js"]