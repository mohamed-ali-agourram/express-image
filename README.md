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
