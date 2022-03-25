# build environment
FROM node:17.8.0-alpine as builder
RUN mkdir /core-docker-dashboard
WORKDIR /core-docker-dashboard
ENV PATH /core-docker-dashboard/node_modules/.bin:$PATH
COPY ./package.json /core-docker-dashboard/package.json
RUN yarn

RUN apk update \
  && apk upgrade \
  && apk add ca-certificates wget && update-ca-certificates \
  && apk add --no-cache --update \
  git \
  curl \
  wget \
  bash \
  make \
  rsync \
  nano
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV TERM xterm-256color
RUN printf 'export PS1="\[\e[0;34;0;33m\][DCKR]\[\e[0m\] \\t \[\e[40;38;5;28m\][\w]\[\e[0m\] \$ "' >> ~/.bashrc
