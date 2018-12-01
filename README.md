[![Build Status](https://travis-ci.org/rolfwessels/coredocker-dashboard.svg?branch=master)](https://travis-ci.org/rolfwessels/coredocker-dashboard)
[![Dockerhub Status](https://img.shields.io/badge/dockerhub-ok-blue.svg)](https://hub.docker.com/r/rolfwessels/coredocker-dashboard/)


# For developers

Getting started

```
yarn
yarn start
```
# Deploy docker files


```
docker-compose build;
docker-compose up;
```

Debugging

```
docker-compose up -d;
docker-compose exec www sh
```

# Deploy to S3


```

yarn build
bash
export  API_URL=https://y6iqsmiv4h.execute-api.eu-west-1.amazonaws.com/Prod
sed -i "s@REPLACE_API_URL@$API_URL@g" ./build/static/js/main.*.js
exit
# upload build folder to bucket
view http://coredocker-www.s3-website-eu-west-1.amazonaws.com/


```

## Todo
 * Add some versioning.
 * Env variables.
 * Add some global state.
 * Add some graph samples
 * Add more avatars :-)



## References
  * https://mherman.org/blog/2017/12/07/dockerizing-a-react-app/
  * https://tabler.github.io/tabler-react/
  * https://github.com/tabler/tabler-react
