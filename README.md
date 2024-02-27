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
