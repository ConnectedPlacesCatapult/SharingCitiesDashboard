#!/bin/bash

unset DEBUG
PREFIX="   -"

# Initialize script
echo "-- FCC Nginx Setup --"

# Move to root directory
cd

# Check if Nginx is installed
echo "$PREFIX Checking for Nginx"
if [ -z "$(which nginx)" ]; then
    # Install Nginx
    echo "   $PREFIX Installing Nginx"
    sudo apt install nginx
fi
echo "   $PREFIX Nginx installed!"

# Allow Nginx profile in firewall
echo "$PREFIX Allow Nginx in firewall"
sudo ufw allow 'Nginx HTTP'

# Setup correct Nginx config file
echo "$PREFIX Setting Nginx config"
sudo mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bkup
sudo cp ~/SharingCitiesDashboard/nginx.conf /etc/nginx/nginx.conf

# Check Nginx status
echo "$PREFIX Checking Nginx status"
NGINX_STATUS=$(sudo systemctl status nginx | grep active | awk '{ print $2 }')
if [ $NGINX_STATUS = "active" ]; then
    # Reload Nginx
    echo "$PREFIX Restarting Nginx"
    sudo systemctl reload nginx
elif [ $NGINX_STATUS = "inactive" ]; then
    # Reload Nginx
    echo "$PREFIX Starting Nginx"
    sudo systemctl start nginx
fi
