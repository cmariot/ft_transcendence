#!/bin/sh

npm install
npm run build
exec npm run start:prod
