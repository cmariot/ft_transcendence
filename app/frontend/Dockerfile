# syntax=docker/dockerfile:1

# Get the container image
FROM node:19-alpine3.16

# Change directory to the project directory
WORKDIR /frontend

# install app dependencies
COPY ./srcs/package.json ./
COPY ./srcs/package-lock.json ./
RUN npm install

# add app
COPY ./srcs .

# Launch the React.js frontend
ENTRYPOINT ["npm"]
CMD ["run", "start"]
