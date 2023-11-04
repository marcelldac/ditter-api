FROM node:latest

# Diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 4000

CMD sh -c "npx prisma generate && npx prisma migrate dev && npm run dev"