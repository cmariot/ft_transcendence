# syntax=docker/dockerfile:1

# Get the container image
FROM node:19-alpine3.16

# Change directory to the project directory
WORKDIR /frontend

# Install app dependencies
COPY ./srcs/package.json ./
COPY ./srcs/package-lock.json ./

RUN npm install react-scripts

RUN npm install

# Add app
COPY ./srcs .

# Launch the React.js frontend
#CMD ["ping", "0.0.0.0"]
ENTRYPOINT ["npm"]
CMD ["run", "start"]
