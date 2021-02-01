from debian:buster-slim

# We need to fake the existence of systemctl
RUN ln -s /bin/true /usr/bin/systemctl

RUN apt-get update && apt-get upgrade -y && apt-get install -y gnupg2 wget tzdata
RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
RUN echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
RUN apt-get update
RUN apt-get install -y mongodb-org=4.4.2 mongodb-org-shell=4.4.2

# Cleanup
RUN rm -rf /usr/bin/systemctl

RUN mkdir -p /home/mongodb
RUN chown -R mongodb:mongodb /home/mongodb

USER mongodb

RUN touch /home/mongodb/.mongorc.js

CMD ["mongo", "--username", "admin", "--password", "u45y38r3h2jt803urhj30892r3htr0", "--authenticationDatabase", "admin", "--host", "localhost", "--port", "27017", "admin"]

# CMD ["mongo", "--username", "{USER}", "--password", "{PASSWORD}", "--authenticationDatabase", "{AUTH_DB_NAME}", "--host", "{HOST}", "--port", "{PORT}", "{DB_NAME}"]
# CMD ["mongo", "mongodb+srv://{USER}:{PASSWORD}@{HOST}:${PORT}/{DB_NAME}"]
