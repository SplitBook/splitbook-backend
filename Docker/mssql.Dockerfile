FROM mcr.microsoft.com/mssql/server:2017-latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./scripts/database/. /usr/src/app

RUN chmod +x /usr/src/app/run-initialization.sh

ENV ACCEPT_EULA Y

EXPOSE 1433

CMD /bin/bash ./entrypoint.sh