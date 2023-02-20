# syntax=docker/dockerfile:1.0

# Get the container Image
FROM nginx:alpine

# Update the index of available packages
# Upgrade the currently installed packages
# Install openssl
RUN apk -U upgrade && apk add --no-cache\
	openssl

# Generate an auto-signed SSL key/certificate pair
RUN mkdir /ssl\
	&& openssl req -x509 -out /ssl/localhost.crt -keyout /ssl/localhost.key \
	-newkey rsa:2048 -nodes -sha256 \
	-subj '/CN=localhost' -extensions EXT -config <( \
	printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

# Add the custom nginx configuration files
COPY ./conf/ft_transcendence.conf /etc/nginx/nginx.conf

EXPOSE 8443

# Launch the webserver
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
