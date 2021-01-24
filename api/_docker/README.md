# Running local MongoDB via Docker

These scripts are meant to be used for local development.

## MongoDB server

To run the MongoDB server (launch `mongod` process), execute:

```sh
cd ./mongod
docker build -t mongod -f Dockerfile .
docker run --net host -e RUN_MIGRATIONS=true mongod
```

If you want to stop the MongoDB server container, open a new terminal, and execute:

```sh
# First, find out the container ID:
docker ps -a | grep -i "up.*minutes"

# You should see something like the following:
# 8992940d5586   mongod         "/bin/bash /data/scr…"   2 minutes ago        Up 2 minutes                          busy_sinoussi

# Use the container ID from above to stop and remove it:
CNTR="8992940d5586" && docker stop $CNTR && docker rm $CNTR
```

## MongoDB client

To run the MongoDB client (launch `mongo` process), open a new terminal, and execute:

```sh
cd ./mongo
docker build -t mongo -f Dockerfile .
docker run --net host -it mongo
```

## MongoDB server logs

To view logs, you need to connect to the running `mongod` container, and inspect the log file:

```sh
# First, find out the container ID:
docker ps -a | grep -i "up.*minutes"

# You should see something like the following:
# 8992940d5586   mongod         "/bin/bash /data/scr…"   2 minutes ago        Up 2 minutes                          busy_sinoussi

# Use the container ID from above to connect to it:
docker exec -it 8992940d5586 /bin/bash

# At this point you are inside the container, and should be presented with a shell. You should see something like:
# mongodb@mint-2647:/data$
#
# NOTE: Instead of `mint-2647`, you will see your Linux host name.

# You can now inspect the contents of the MongoDB logs. To see the last 2 lines:
cat /data/log/mongod.log | tail -n 2

# You should see something like:
# {"t":{"$date":"2021-01-24T06:08:57.443+00:00"},"s":"I",  "c":"NETWORK",  "id":51800,   "ctx":"conn7","msg":"client metadata","attr":{"remote":"127.0.0.1:51664","client":"conn7","doc":{"application":{"name":"MongoDB Shell"},"driver":{"name":"MongoDB Internal Client","version":"4.4.2"},"os":{"type":"Linux","name":"PRETTY_NAME=\"Debian GNU/Linux 10 (buster)\"","architecture":"x86_64","version":"Kernel 5.4.0-62-generic"}}}}
# {"t":{"$date":"2021-01-24T06:08:57.458+00:00"},"s":"I",  "c":"ACCESS",   "id":20250,   "ctx":"conn7","msg":"Successful authentication","attr":{"mechanism":"SCRAM-SHA-256","principalName":"admin","authenticationDatabase":"admin","client":"127.0.0.1:51664"}}
```
