# syntax=docker/dockerfile:1

# Get the container image
FROM node:19-alpine3.16

# Install NestJs cli
RUN npm install -g @nestjs/cli

# Create the backend directory
WORKDIR /srcs

# Copy the backend files
COPY ./srcs .
COPY ./entrypoint.sh /

# Launch the backend entrypoint script
# (npm install + npm run start:debug)
ENTRYPOINT ["sh", "/entrypoint.sh"]
