FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . . 

RUN rm -rf dist && npx prisma generate && npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
