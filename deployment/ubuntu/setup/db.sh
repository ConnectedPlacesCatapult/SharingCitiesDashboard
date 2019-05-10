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
    sudo apt-get install postgis* libpq-dev
fi
echo "   $PREFIX Postgres installed!"

# Create SharingCities system user
echo "$PREFIX Creating SharingCities DB user"
sudo useradd -p $(openssl passwd -1 SharingCities) sharingcities
sudo usermod -aG sudo sharingcities

# Create SharingCities DB user
echo "$PREFIX Creating SharingCities DB user"
sudo -u postgres psql -c "CREATE USER sharingcities WITH PASSWORD 'sharingcities'"
sudo -u postgres psql -c "ALTER USER sharingcities WITH superuser"

# Create analytics DB
echo "$PREFIX Creating analytics DB"
sudo -u sharingcities psql -d postgres -c "CREATE DATABASE analytics"

# Install PostGIS extension on analytics DB
echo "$PREFIX Creating postgis extension"
sudo -u sharingcities psql -d analytics -c "CREATE EXTENSION postgis"

# Return to root directory
cd

# Finished
echo "-- DB Setup Complete --"
