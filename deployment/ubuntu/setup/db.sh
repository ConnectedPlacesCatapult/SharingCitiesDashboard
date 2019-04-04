#!/bin/bash

unset DEBUG
PREFIX="   -"

# Set install flags
if [ ! $PYREQ_INSTALLED ]; then
    export PYREQ_INSTALLED=False
fi

# Initialize script
echo "-- FCC DB Setup --"

# Check if postgres is installed
echo "$PREFIX Checking for postgres"
if [ -z "$(which psql)" ]; then
    # Install postgres
    echo "   $PREFIX Installing postgresql"
    sudo apt update
    sudo apt install postgresql postgresql-contrib
    sudo apt-get install postgis
fi
echo "   $PREFIX Postgres installed!"

# Create SharingCities user
echo "$PREFIX Creating SharingCities DB user"
sudo -u postgres psql -c "CREATE USER sharingcities WITH PASSWORD 'sharingcities'"

# Create analytics DB
echo "$PREFIX Creating analytics DB"
sudo -u postgres psql -c "CREATE DATABASE analytics"

# Grant DB privileges to SharingCities user
echo "$PREFIX Granting privileges to SharingCities user"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE analytics to sharingcities"

# Install PostGIS extension on analytics DB
echo "$PREFIX Creating postgis extension"
sudo -u postgres psql -d analytics -c "CREATE EXTENSION postgis"

# Move to Analytics directory
cd ~/SharingCitiesDashboard/Analytics

# Check if python requirements have been installed
if [ $PYREQ_INSTALLED = False ]; then
    # Install python requirements
    echo "$PREFIX Installing python requirements"
    pip3 install -r requirements.txt
    export PYREQ_INSTALLED=True
fi

# Setup DB structure
echo "$PREFIX Initialize DB structure"
python3 db_setup.py

# Create SuperUser account
echo "$PREFIX Setup SuperUser account"
python3 manage.py add_superuser

# Return to root directory
cd

# Finished
echo "-- DB Setup Complete --"
