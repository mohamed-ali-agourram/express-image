# EXPRESS-IMAGE

## Build the Docker image

```shell
docker build . -t express-app
```

## Run the Docker container

this command will run the conatiner mounting the local folder to catch changes on dev using volumes and ignoring node_modules folder

```shell
docker run -it -p 3000:3000 -v $(pwd):/usr/src/app -v /usr/src/app/node_modules --rm express-app
```

## Make a redeonly bind mount so the docker container wont effect the local machine

add :ro (read only) to the end of teh mount

```shell
docker run -it -p 3000:3000 -v $(pwd):/usr/src/app:ro -v /usr/src/app/node_modules --rm express-app
```

## Pass env varibales

```shell
docker run -it --env PORT=5000 -p 5000:5000 -v $(pwd):/usr/src/app:ro -v /usr/src/app/node_modules --rm express-app
```

or load the env file from local machine

```shell
docker run -it --env-file ./.env  -p 5000:5000 -v $(pwd):/usr/src/app:ro -v /usr/src/app/node_modules --rm express-app 
```

## Docker Compose

note that you need to have a docker-compose.yml file on the root that has all configyartion for the containers needed in the app

[docker compose versions](https://docs.docker.com/compose/compose-file/compose-versioning/)

```shell
docker-compose up -d
docker-compose up -d --build
docker-compose down -v
```

## Run Multiple docker-compose files for dev/prod

docker-compose.yml: base file configuration

```shell
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build(force new build)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build #(force new build)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down -v
```

## Adding a Mongo Container

```shell
docker exec -it express_mongo_1 mongosh -u root -p root
```

## Container bootup order

loadup mongo instance before node container and that by depending a service into another
services:
  node-app:
    depends_on:
      - mongo

## Authentication with sessions & Redis

you can add a new image even if the docker-compose is alrdy runing since dokcer can detect changes on the docker-compose.yml and just apply them

```shell
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
npm install redis connect-redis express-session
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -V #this to build with new anonymos volumes
```

## Nginx for Load balancing to multiple node containers

scale into two nodes instances

```shell
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --scale node-app=2
```
