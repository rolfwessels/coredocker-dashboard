# For developers

[![Build Status](https://travis-ci.org/rolfwessels/coredocker-dashboard.svg?branch=master)](https://travis-ci.org/rolfwessels/coredocker-dashboard)
[![Dockerhub Status](https://img.shields.io/badge/dockerhub-ok-blue.svg)](https://hub.docker.com/r/rolfwessels/coredocker-dashboard/)

## Getting started

Open the docker environment to do all development and deployment

```bash
# bring up dev environment
make build up
# build the project ready for publish
make publish
```

## Available make commands

### Commands outside the container

- `make up` : brings up the container & attach to the default container
- `make down` : stops the container
- `make build` : builds the container

### Commands to run inside the container

- `make config` : Used to create aws config files
- `make init` : Initialize terraform locally
- `make plan` : Run terraform plan
- `make apply` : Run terraform Apply

## Deploy to S3

```cmd
yarn build
bash
export  API_URL=https://123123123123.execute-api.eu-west-1.amazonaws.com/Prod
sed -i "s@REPLACE_API_URL@$API_URL@g" ./build/static/js/main.*.js
exit
# upload build folder to bucket
view http://coredocker-www.s3-website-eu-west-1.amazonaws.com/
```

## Todo

- Add some versioning.
- Env variables.
- Add some global state.
- Add some graph samples
- Switch to <https://mui.com/>

## References

- <https://mherman.org/blog/2017/12/07/dockerizing-a-react-app/>
- <https://tabler.github.io/tabler-react/>
- <https://github.com/tabler/tabler-react>
