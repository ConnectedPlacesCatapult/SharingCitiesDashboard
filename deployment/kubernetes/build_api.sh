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
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Create the deployment file
    echo "  - Creating api-deployment.yaml file..."
    cp ./api-template.yaml ./api-deployment.yaml
    # Update file
    echo "Updating API deployment file..."
    sed -i '' -e 's@<<api-image-details>>@'$api_image_details'@g' ./api-deployment.yaml
    # Build and tag Dockerfile
    echo "Building API Dockerfile..."
    docker build -f Dockerfile-API -t $api_image_details ../../
    # Push API docker image
    echo "Pushing API Docker image..."
    docker push $api_image_details

    # Confirm deployment with user
    read -p "Do you want to deploy/update the API? $api_image_details [y/N]: " -n 1 -r
    echo    # (optional) move to a new line
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Apply the file
        echo "  - Deploying the DB file..."
        kubectl apply -f ./api-deployment.yaml

        # Confirm file removal with user
        read -p "Do you want to remove the generated file? (api-deployment.yaml) [y/N]: " -n 1 -r
        echo    # (optional) move to a new line
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "  - Removing api-deployment.yaml file..."
            rm ./api-deployment.yaml
        elif [[ $REPLY =~ ^[Nn]$ ]]; then
            cleaned_version=${api_version//./_}
            echo "  - Renaming file to ./api-deployment$cleaned_version.yaml ..."
            mv ./api-deployment ./api-deployment$cleaned_version.yaml
        fi
        # User cancelled/chose "No"
    fi
    # User cancelled/chose "No"
fi
# User cancelled/chose "No"
