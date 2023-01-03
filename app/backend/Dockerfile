# syntax=docker/dockerfile:1

# Get the container image
FROM node:19-alpine3.16

# Create the project directory
WORKDIR /backend

# Install nest
RUN npm i -g @nestjs/cli

# Install app dependencies
COPY ./srcs/package.json ./
COPY ./srcs/package-lock.json ./
RUN npm install

# Add backend files
COPY ./srcs .

# Launch the Nest.js backend
ENTRYPOINT ["npm"]
CMD ["run", "start:dev"]
