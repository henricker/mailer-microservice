FROM node:alpine
WORKDIR /usr/app
COPY build .
RUN npm install