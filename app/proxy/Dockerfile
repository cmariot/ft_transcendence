# syntax=docker/dockerfile:1

# Get the container Image
FROM nginx:alpine

# Add the custom nginx configuration files
COPY ./conf/ft_transcendence.conf /etc/nginx/http.d/

# Launch the webserver
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
