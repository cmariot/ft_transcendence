# syntax=docker/dockerfile:1

# Get the container Image
FROM nginx:alpine

# Update the index of available packages
# Upgrade the currently installed packages
# Install openssl
RUN apk update && apk upgrade && apk add --no-cache\
	openssl

# Generate an auto-signed SSL key/certificate pair
RUN mkdir /ssl\
	&& openssl req -new -newkey rsa:4096 -x509 -sha256 -days 365 -nodes \
	-out /ssl/ft_transcendence.pem \
	-keyout /ssl/ft_transcendence.key \
	-subj "/C=FR/ST=Paris/L=Paris/O=42/OU=student/CN=ft_transcendence"\
	&& chmod 600 /ssl/ft_transcendence.pem /ssl/ft_transcendence.key

# Create the cache directory
RUN mkdir -p /var/lib/nginx/cache\
	&& chown www-data /var/lib/nginx/cache\
	&& chmod 700 /var/lib/nginx/cache

# Add the custom nginx configuration files
COPY ./conf/ft_transcendence.conf /etc/nginx/nginx.conf

EXPOSE 443

# Launch the webserver
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
