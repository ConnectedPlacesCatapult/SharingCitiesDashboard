#!/bin/bash

unset DEBUG
PREFIX="   -"

# Set install flags
if [ ! $PYREQ_INSTALLED ]; then
    export PYREQ_INSTALLED=False
fi

# Initialize script
echo "-- FCC API Setup --"

# Move to Analytics directory
cd ~/SharingCitiesDashboard/Analytics

# Check if python requirements have been installed
if [ $PYREQ_INSTALLED = False ]; then
    # Check if pip is installed
    if [ -z "$(which pip3)" ]; then
        # Install python3-pip3
        echo "$PREFIX Installing pip3"
        sudo apt install python3-pip
    fi
    # Install python requirements
    echo "$PREFIX Installing python requirements"
    pip3 install -r requirements.txt
    export PYREQ_INSTALLED=True
fi

# Set env values
export $(xargs <~/SharingCitiesDashboard/.env)

# Rename settings.py.bak
echo "$PREFIX Initializing flask settings"
mv settings.py.bak settings.py

# Setup DB structure
echo "$PREFIX Initialize DB structure"
python3 db_setup.py

# Create SuperUser account
echo "$PREFIX Setup SuperUser account"
python3 manage.py add_superuser

# Serve the API on port 5000
python3 manage.py gunicorn
