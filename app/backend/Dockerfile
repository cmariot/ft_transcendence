# syntax=docker/dockerfile:1

# Get the container image
FROM node:19-alpine3.16

# Update and Upgrade the list of packages
RUN apk -U upgrade

# Update npm (new minor version available)
RUN npm install -g npm@9.6.3

# Create the backend directory
WORKDIR /srcs

# Copy the backend files
COPY ./srcs/default default
COPY ./srcs/src src
COPY ./srcs/nest-cli.json nest-cli.json
COPY ./srcs/package.json package.json
COPY ./srcs/package-lock.json package-lock.json
COPY ./srcs/tsconfig.build.json tsconfig.build.json
COPY ./srcs/tsconfig.build.json tsconfig.build.json

COPY ./entrypoint.sh /

# Launch the backend entrypoint script
# (npm install + npm run start:debug)
ENTRYPOINT ["sh", "/entrypoint.sh"]
