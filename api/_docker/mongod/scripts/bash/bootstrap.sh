#!/bin/bash

if [[ -z "${DO_CREATE_USERS}" ]]; then
  /data/scripts/bash/no-migration.sh &
else
  /data/scripts/bash/migration.sh &
fi

mongod --config /data/config/mongod.conf

exit 0
