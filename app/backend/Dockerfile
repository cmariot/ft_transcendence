# syntax=docker/dockerfile:1

# Get the container image
FROM node:19-alpine3.16

# Update and Upgrade the list of packages
RUN apk -U upgrade

# Update npm (new minor version available)
RUN npm install -g npm@9.6.5

# Create the backend directory
WORKDIR /srcs

# Copy the backend files
COPY ./srcs/src src
COPY ./srcs/package.json package.json
COPY ./srcs/package-lock.json package-lock.json
COPY ./srcs/nest-cli.json nest-cli.json
COPY ./srcs/tsconfig.json tsconfig.json
COPY ./srcs/tsconfig.build.json tsconfig.build.json
COPY ./srcs/default default

# Copy the entrypoint script
COPY ./entrypoint.sh /

# Launch the backend entrypoint script
ENTRYPOINT ["sh", "/entrypoint.sh"]
