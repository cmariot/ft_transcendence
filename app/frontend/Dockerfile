# syntax=docker/dockerfile:1.0

# Get the container image
FROM node:19-alpine3.16

# Update and Upgrade the list of packages
RUN apk -U upgrade

# Create the frontend directory
WORKDIR /srcs

# Add '/srcs/node_modules/.bin' to $PATH
ENV PATH /srcs/node_modules/.bin:$PATH

# Copy the frontend files
COPY ./srcs .
COPY ./entrypoint.sh /

# Launch the frontend entrypoint script
# (npm install + npm run start)
ENTRYPOINT ["sh", "/entrypoint.sh"]