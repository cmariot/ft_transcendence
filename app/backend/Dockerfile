# syntax=docker/dockerfile:1

# Get the container image
FROM node:19-alpine3.16

# Update and Upgrade the list of packages
RUN apk -U upgrade

# Create the backend directory
WORKDIR /srcs

# Copy the backend files
COPY ./srcs .
COPY ./entrypoint.sh /

# Launch the backend entrypoint script
# (npm install + npm run start:debug)
ENTRYPOINT ["sh", "/entrypoint.sh"]
