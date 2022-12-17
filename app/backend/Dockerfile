# syntax=docker/dockerfile:1

# Get the container image
FROM alpine:3.16

# Update the index of available packages,
# Upgrade the currently installed packages,
# Install Node.js and npm (the Node.js package manager)
RUN apk update && apk upgrade && apk add --no-cache\
	nodejs\
	npm

# Copy the Nest.js srcs files in the container
COPY ./srcs /backend

# Change directory to the project directory
WORKDIR /backend

# Install dependencies
RUN npm install

# Launch the Nest.js backend
ENTRYPOINT ["npm"]
CMD ["run", "start"]
