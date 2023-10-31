FROM node:latest

# Diretório de trabalho dentro do contêiner
WORKDIR /app

COPY package*.json .
RUN npm install
COPY . .
EXPOSE 4000
CMD [ "npm", "run", "dev" ]
