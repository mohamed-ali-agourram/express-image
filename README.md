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

## Express CORS

CORS allows you to run front-end on a domain and back-end to run on a diffrent domain
since backend wont accept requests by default from another domain u need to setup CORS(Cross-origin resource sharing)

## Dev to Prod Workflow

```shell
# we will only toglle node-app to perevent rebuilding database or the redis datastore 
# after making changes we build
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build node-app
# push to docker hub
docker-compose -f docker-compose.yml -f docker-compose.dev.yml push node-app  
# on the prod server pull from docker hub
docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull node-app
# finally run again by rebuilding on teh prod
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps node-app
```

## Automating with watchtower

Automaticly Detect changes on Docker Hub image and pull that new image using watchtower

```shell
# on prod server:
docker run -d --name watchtower -e WATCHTOWER_TRACE=true -e WATCHTOWER_DEBUG=true -e WATCHTOWER_POLL_INTERVAL=50 -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower express-image-node-app-1
# now after just build and push on the local machine the watchtower on the WATCHTOWER_POLL_INTERVAL will pull the new image
# note that if ur pulling from a private docker hub repo you will need to login on the prod in order for WATCHTOWER to work
```
