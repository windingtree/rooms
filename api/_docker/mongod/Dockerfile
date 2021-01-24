from debian:buster-slim

# We need to fake the existence of systemctl
RUN ln -s /bin/true /usr/bin/systemctl

RUN apt-get update && apt-get upgrade -y && apt-get install -y gnupg2 wget tzdata
RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
RUN echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
RUN apt-get update
RUN apt-get install -y mongodb-org=4.4.2 mongodb-org-server=4.4.2 mongodb-org-shell=4.4.2 mongodb-org-mongos=4.4.2 mongodb-org-tools=4.4.2

# Cleanup
RUN rm -rf /usr/bin/systemctl

RUN mkdir -p /home/mongodb
RUN chown -R mongodb:mongodb /home/mongodb

RUN mkdir -p /data/db
RUN mkdir -p /data/log

COPY scripts/ /data/scripts
COPY config/ /data/config
RUN chmod u+x /data/scripts/bash/*.sh

RUN chown -R mongodb:mongodb /data

USER mongodb
WORKDIR /data

EXPOSE 27017
ENTRYPOINT ["/bin/bash", "/data/scripts/bash/bootstrap.sh"]
