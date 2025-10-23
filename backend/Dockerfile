FROM node:22-alpine3.21

WORKDIR /usr/app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install

COPY .env ./.env

COPY tsconfig.json ./

COPY . .

RUN npm run build

RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "run", "start"]