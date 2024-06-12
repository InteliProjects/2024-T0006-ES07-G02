FROM node:alpine

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=1536"

COPY . .

RUN npm i

RUN npm run build

CMD ["npm", "run", "start:prod"]