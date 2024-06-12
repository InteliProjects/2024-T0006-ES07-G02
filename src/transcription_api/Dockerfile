FROM node:latest

WORKDIR /app

COPY . .

RUN npm i

EXPOSE 3008

RUN npm run build

CMD ["npm", "run", "start:prod"]