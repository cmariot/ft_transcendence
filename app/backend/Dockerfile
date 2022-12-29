# syntax=docker/dockerfile:1

# Get the container image
FROM node:13.12.0-alpine

# Change directory to the project directory
WORKDIR /backend

# add '/frontend/node_modules/.bin' to $PATH
ENV PATH /backend/node_modules/.bin:$PATH

# install app dependencies
COPY ./srcs/package.json ./
COPY ./srcs/package-lock.json ./
RUN npm install

# add app
COPY ./srcs .

# Launch the Nest.js backend
ENTRYPOINT ["npm"]
CMD ["run", "start"]
