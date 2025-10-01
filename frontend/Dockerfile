FROM node:latest

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY ./.env.production ./.env

COPY tsconfig.json ./

COPY . .

RUN npx next telemetry disable

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]