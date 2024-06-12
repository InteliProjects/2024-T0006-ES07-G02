FROM node:latest

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=1536"

COPY . .

RUN npm i --force

CMD ["npm", "run", "dev", "--host", "--", "--port", "3000"]