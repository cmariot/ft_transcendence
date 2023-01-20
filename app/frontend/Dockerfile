# syntax=docker/dockerfile:1.0

# Get the container image
FROM node:19-alpine3.16

# Create the frontend directory
WORKDIR /srcs

# Copy the frontend files
COPY ./srcs .
COPY ./entrypoint.sh /

# Launch the frontend entrypoint script
# (npm install + npm run start)
ENTRYPOINT ["sh", "/entrypoint.sh"]
