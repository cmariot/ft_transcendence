# syntax=docker/dockerfile:1

# Get the container image
FROM node:19-alpine3.16

RUN npm install -g @nestjs/cli

# Create the project directory
WORKDIR /backend

# Install app dependencies
COPY ./srcs/package.json ./
COPY ./srcs/package-lock.json ./
RUN npm install

# Add backend files
COPY ./srcs .

# Launch the Nest.js backend
#ENTRYPOINT ["ping"]
#CMD ["0.0.0.0"]
ENTRYPOINT ["npm"]
CMD ["run", "start"]
