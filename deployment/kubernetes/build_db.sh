#!/bin/sh

# Get Container registry details
read -p "Enter DB Container Registry Address: " reg_address

# Get Container Image version
read -p "Enter DB Image Version: " db_version

# Set Image details value
db_image_details=$reg_address"db:"$db_version

# Confirm details with user
echo "NB: Please check and confirm value, this will build and push the DB dockerfile!"
read -p "Is this correct? $db_image_details [y/N]: " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    # Update file
    echo "Updating DB deployment file..."
    sed -i '' -e 's@<<db-image-details>>@'$db_image_details'@g' ./db.yaml
    # Build and tag Dockerfile
    echo "Building DB Dockerfile..."
    docker build -f Dockerfile-DB -t $db_image_details ../../
    # Push DB docker image
    echo "Pushing DB Docker image..."
    docker push $db_image_details
fi
# User cancelled/chose "No"
