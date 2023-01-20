# syntax=docker/dockerfile:1

# Get the container image
FROM node:19-alpine3.16

# Install NestJs cli
RUN npm install -g @nestjs/cli

# Create the project directory
WORKDIR /srcs

# Install app dependencies
COPY ./srcs/package.json ./
COPY ./srcs/package-lock.json ./
RUN npm install

# Add backend files
COPY ./srcs .

# Launch the Nest.js backend
ENTRYPOINT ["npm"]
CMD ["run", "start:debug"]
