
FROM node:18.18.2

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

ARG PORT=6000
EXPOSE ${PORT}

CMD ["node", "index.js"]