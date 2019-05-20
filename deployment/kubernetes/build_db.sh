#!/bin/sh

# Get Container registry details
read -p "Enter DB Container Registry Address: " reg_address

# Get Container Image version
read -p "Enter DB Image Version: " db_version

# Set Image details value
db_image_details=$reg_address"db:"$db_version

# Confirm deployment details with user
echo "NB: Please check and confirm value, this will build and push the DB dockerfile!"
read -p "Is this correct? $db_image_details [y/N]: " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]] then
    # Create the deployment file
    echo "  - Creating db-deployment.yaml file..."
    cp ./db-template.yaml ./db-deployment.yaml
    # Update file
    echo "  - Updating DB deployment file..."
    sed -i '' -e 's@<<db-image-details>>@'$db_image_details'@g' ./db-deployment.yaml
    # Build and tag Dockerfile
    echo "  - Building DB Dockerfile..."
    docker build -f Dockerfile-DB -t $db_image_details ../../
    # Push DB docker image
    echo "  - Pushing DB Docker image..."
    docker push $db_image_details

    # Confirm deployment with user
    read -p "Do you want to deploy/update the DB? $db_image_details [y/N]: " -n 1 -r
    echo    # (optional) move to a new line
    if [[ $REPLY =~ ^[Yy]$ ]] then
        # Apply the file
        echo "  - Deploying the DB file..."
        kubectl apply -f ./db-deployment.yaml

        # Confirm file removal with user
        read -p "Do you want to remove the generated file? (db-deployment.yaml) [y/N]: " -n 1 -r
        echo    # (optional) move to a new line
        if [[ $REPLY =~ ^[Yy]$ ]] then
          echo "  - Removing db-deployment.yaml file..."
          rm ./db-deployment.yaml
        elif [[ $REPLY =~ ^[Nn]$ ]] then
          cleaned_version=${db_version//./_}
          echo "  - Renaming file to ./db-deployment$cleaned_version.yaml ..."
          mv ./db-deployment ./db-deployment$cleaned_version.yaml
        fi
        # User cancelled/chose "No"
    fi
    # User cancelled/chose "No"
fi
# User cancelled/chose "No"
