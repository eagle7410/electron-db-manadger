#!/usr/bin/env bash

# Stop containers

docker stop mongo
docker stop mysql
docker stop myadmin

docker stop redis_manager
docker stop redis

docker stop postgis
docker stop postgres
docker stop pgadmin

# Delete containers

docker rm mongo
docker rm mysql
docker rm myadmin
docker rm redis_manager
docker rm redis
docker rm postgis
docker rm postgres
docker rm pgadmin

# Delete images

docker rmi mongo
docker rmi mysql/mysql-server
docker rmi phpmyadmin/phpmyadmin
docker rmi tenstartups/redis-commander
docker rmi redis
docker rmi mdillon/postgis
docker rmi postgres
docker rmi fenglc/pgadmin4

echo "Images ---->"
docker images
echo "Containers ---->"
docker ps --all
