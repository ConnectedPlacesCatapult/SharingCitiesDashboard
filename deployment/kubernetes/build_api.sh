#!/bin/sh

# Get Container registry details
read -p "Enter API Container Registry Address: " reg_address

# Get Container Image version
read -p "Enter API Image Version: " api_version

# Set Image details value
api_image_details=$reg_address"api:"$api_version

# Confirm details with user
echo "NB: Please check and confirm value, this will build and push the API dockerfile!"
read -p "Is this correct? $api_image_details [y/N]: " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    # Update file
    echo "Updating API deployment file..."
    sed -i '' -e 's@<<api-image-details>>@'$api_image_details'@g' ./api.yaml
    # Build and tag Dockerfile
    echo "Building API Dockerfile..."
    docker build -f Dockerfile-API -t $api_image_details ../../
    # Push API docker image
    echo "Pushing API Docker image..."
    docker push $api_image_details
fi
# User cancelled/chose "No"
