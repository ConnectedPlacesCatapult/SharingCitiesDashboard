#!/bin/sh

function getApiAddress() {
    # Get API address
    read -p "Enter API IP-Address: " api_address
    # Confirm API address
    echo "NB: Please check and confirm ip, this will replace the API address in the code!"
    read -p "Is this correct? $api_address [y/N]: " -n 1 -r
    echo    # (optional) move to a new line
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "  - Inserting API address into code..."
        sed -i '' -e 's@<<api-address>>@'$api_address'@g' ../../Frontend/fcc.config.js
        sed -i '' -e 's@<<api-address>>@'$api_address'@g' ../../Frontend/src/api/axios.js
        sed -i '' -e 's@<<api-address>>@'$api_address'@g' ../../Frontend/src/api/urls.js
        touch ./api_address && echo $api_address > ./api_address
    else
        # Exit if no API address provided
        echo "Cannot continue without an API address!"
        exit
    fi
}

# Check if API details exist
if [ ! -f ./api_address ]; then
    # Collect API address
    getApiAddress
else
    # Confirm existing API address is correct
    api_address="$(cat ./api_address)"
    read -p "Is this address still correct? $api_address [y/N]: " -n 1 -r
    echo    # (optional) move to a new line
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        # Remove API address file
        rm ./api_address
        # Collect new API address
        getApiAddress
    fi
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
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Create the deployment file
    echo "  - Creating ui-deployment.yaml file..."
    cp ./ui-template.yaml ./ui-deployment.yaml
    # Update file
    echo "  - Updating UI deployment file..."
    sed -i '' -e 's@<<ui-image-details>>@'$ui_image_details'@g' ./ui-template.yaml
    # Build and tag Dockerfile
    echo "  - Building UI Dockerfile..."
    docker build -f Dockerfile-UI -t $ui_image_details ../../
    # Push UI docker image
    echo "  - Pushing UI Docker image..."
    docker push $ui_image_details

    # Confirm deployment with user
    read -p "Do you want to deploy/update the UI? $ui_image_details [y/N]: " -n 1 -r
    echo    # (optional) move to a new line
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Apply the file
        echo "  - Deploying the UI file..."
        kubectl apply -f ./ui-deployment.yaml

        # Confirm file removal with user
        read -p "Do you want to remove the generated file? (ui-deployment.yaml) [y/N]: " -n 1 -r
        echo    # (optional) move to a new line
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "  - Removing ui-deployment.yaml file..."
            rm ./ui-deployment.yaml
        elif [[ $REPLY =~ ^[Nn]$ ]]; then
            cleaned_version=${api_version//./_}
            echo "  - Renaming file to ./api-deployment$cleaned_version.yaml ..."
            mv ./ui-deployment ./ui-deployment$cleaned_version.yaml
        fi
        # User cancelled/chose "No"
    fi
    # User cancelled/chose "No"
fi
# User cancelled/chose "No"
