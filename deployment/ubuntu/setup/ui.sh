#!/bin/bash

unset DEBUG
PREFIX="   -"

# Set environment variables
export EXT_IP=$(dig +short myip.opendns.com @resolver1.opendns.com)
export API_ADDRESS=$EXT_IP/api

# Initialize script
echo "-- FCC UI Setup --"

# Check if node is installed
echo "$PREFIX Checking for node"
if [ -z "$(npm -v)" ]; then
    # Install postgres
    echo "   $PREFIX Installing node"
    curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
    sudo apt install nodejs
fi
echo "   $PREFIX Node installed!"

# Move to Frontend directory
cd ~/SharingCitiesDashboard/Frontend

# Install node dependencies
echo "$PREFIX Installing node dependenciess"
npm i --save

# Build UI for Production
echo "$PREFIX Building UI for Production"
npm run build

# Check if serve is installed
echo "$PREFIX Checking for serve package"
if [ "$(npm list -g serve | grep empty)" ]; then
    echo "   $PREFIX Installing serve"
    sudo npm install -g serve
fi
echo "   $PREFIX Serve installed!"

# Serve the UI on port 8080
# sudo serve -s build -l 8080
