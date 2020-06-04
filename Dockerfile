FROM node:12.16.3

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8085


CMD ["npm","start"]
