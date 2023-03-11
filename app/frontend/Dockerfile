# syntax=docker/dockerfile:1.0

# ---------------------------------------- #
#              Development App             # 
#               (development)              # 
# ---------------------------------------- #

#    # Get the container image
#    FROM node:19-alpine3.16 AS development
#    
#    # Update and Upgrade the list of packages
#    RUN apk -U upgrade
#    
#    # Create the frontend directory
#    WORKDIR /development
#    
#    # Add '/srcs/node_modules/.bin' to $PATH
#    ENV PATH /development/node_modules/.bin:$PATH
#    
#    # Copy the frontend files
#    COPY ./srcs .
#    COPY ./entrypoint.sh /
#    
#    # Launch the frontend entrypoint script
#    # (npm install + npm run start)
#    ENTRYPOINT ["sh", "/entrypoint.sh"]


# ---------------------------------------- #
#              Optimized App               # 
#               (production)               # 
# ---------------------------------------- #

    # Get the container image
    FROM node:19-alpine3.16 AS production
    
    # Update and Upgrade the list of packages
    RUN apk -U upgrade
    
    # Create the frontend directory
    WORKDIR /production
    
    # Install the app dependencies
    COPY ./srcs/package.json package.json
    COPY ./srcs/package-lock.json package-lock.json
    RUN npm ci
    
    # Copy the app srcs
    COPY ./srcs/public/ public
    COPY ./srcs/src/ src
    COPY ./srcs/tsconfig.json tsconfig.json
    
    # Build the app
    RUN npm run build
    
    RUN npm install -g serve
    
    ENTRYPOINT ["serve", "-s", "build"]
