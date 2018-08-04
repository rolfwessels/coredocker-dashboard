# build environment
FROM node:10.8-alpine as builder
RUN mkdir /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json /app/package.json
RUN yarn
COPY ./src /app/src
COPY ./public /app/public
ENV API_URL REPLACE_API_URL
RUN yarn build

# production environment
FROM nginx:1.13.9-alpine
RUN rm /etc/nginx/conf.d/*
COPY var/nginx/default.conf /etc/nginx/conf.d
RUN ls -la /etc/nginx/conf.d
COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=builder /app/build /usr/share/nginx/htmltemplate
EXPOSE 80



RUN echo "rm /usr/share/nginx/html/static/js/main.*.js" >  run.sh
RUN echo "cp /usr/share/nginx/htmltemplate/static/js/main.*.js /usr/share/nginx/html/static/js/" >>  run.sh
RUN echo "sed -i \"s@REPLACE_API_URL@\$API_URL@g\" /usr/share/nginx/html/static/js/main.*.js" >> run.sh
RUN echo "nginx -g 'daemon off;'" >>  run.sh
RUN cat run.sh
#cat /usr/share/nginx/html/static/js/main.*.js | grep -o '.........................................................REPLACE_API_URL.......................................'
# CMD ["nginx", "-g", "daemon off;"]
CMD ["sh", "run.sh"]
