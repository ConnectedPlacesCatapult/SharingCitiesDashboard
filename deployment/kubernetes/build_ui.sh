#!/bin/sh

# Get API address
read -p "Enter API IP-Address: " api_address

# Confirm API address
echo "NB: Please check and confirm ip, this will replace the API address in the code!"
read -p "Is this correct? $api_address [y/N]: " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Inserting API address into code..."
    sed -i '' -e 's@<<api-address>>@'$api_address'@g' ../../Frontend/fcc.config.js
    sed -i '' -e 's@<<api-address>>@'$api_address'@g' ../../Frontend/src/api/axios.js
    sed -i '' -e 's@<<api-address>>@'$api_address'@g' ../../Frontend/src/api/urls.js
else
    exit
fi

# Get Container registry details
read -p "Enter UI Container Registry Address: " reg_address

# Get Container Image version
read -p "Enter UI Image Version: " ui_version

# Set Image details value
ui_image_details=$reg_address"ui:"$ui_version

# Confirm details with user
echo "NB: Please check and confirm value, this will build and push the UI dockerfile!"
read -p "Is this correct? $ui_image_details [y/N]: " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    # Update file
    echo "Updating UI deployment file..."
    sed -i '' -e 's@<<ui-image-details>>@'$ui_image_details'@g' ./ui.yaml
    # Build and tag Dockerfile
    echo "Building UI Dockerfile..."
    docker build -f Dockerfile-UI -t $ui_image_details ../../
    # Push UI docker image
    echo "Pushing UI Docker image..."
    docker push $ui_image_details
fi
# User cancelled/chose "No"
