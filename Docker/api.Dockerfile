FROM node:12.16.3

WORKDIR /home/node/app

COPY ./package*.json ./
RUN npm install

COPY ./ .

RUN chmod +x /home/node/app/scripts/api/run-initialization.sh

EXPOSE 8085

CMD /bin/bash ./scripts/api/entrypoint.sh
