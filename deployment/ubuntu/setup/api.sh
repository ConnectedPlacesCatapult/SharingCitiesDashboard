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

# Check if Redis is installed
echo "$PREFIX Checking for Redis"
if [ -z "$(which redis)" ]; then
    # Install Nginx
    echo "   $PREFIX Installing Redis"
    sudo apt install redis-server
fi
echo "   $PREFIX Redis installed!"

# Setup correct Nginx config file
echo "$PREFIX Setting Redis config"
sudo mv /etc/redis/redis.conf /etc/redis/redis.conf.bkup
sudo cp ~/SharingCitiesDashboard/deployment/ubuntu/redis.conf /etc/redis/redis.conf
sudo systemctl restart redis.service

# Start Celery worker
echo "$PREFIX Starting Celery worker"
alias python='python3.6'
celery -A manage.celery_task worker -l info

# Setup DB structure
echo "$PREFIX Initialize DB structure"
python3 db_setup.py

# Create SuperUser account
echo "$PREFIX Setup SuperUser account"
python3 manage.py add_superuser

# Serve the API on port 5000
python3 manage.py gunicorn
