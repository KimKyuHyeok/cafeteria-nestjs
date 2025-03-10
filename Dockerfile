FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install && npx prisma generate && npm run build

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
