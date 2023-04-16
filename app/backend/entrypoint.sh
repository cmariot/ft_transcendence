#!/bin/sh

# Script to run the nestjs backend server in development mode
# This script is used by docker-compose.yml

npm install
npm run build

# Run in development mode
#exec npm run start:dev

# Run in production mode
exec npm run start:prod
