# syntax=docker/dockerfile:1

# Get the container image
FROM alpine:3.16

# Update the index of available packages,
# Upgrade the currently installed packages,
# Install Node.js and npm (the Node.js package manager)
RUN apk update && apk upgrade

# Change directory to the project directory
WORKDIR /database

# Launch the Nest.js backend
ENTRYPOINT ["ping"]
CMD ["0.0.0.0"]
