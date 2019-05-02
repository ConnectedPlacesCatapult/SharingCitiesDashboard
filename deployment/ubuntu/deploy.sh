#!/bin/bash

unset DEBUG
PREFIX="   -"

# Set install flags
export PYREQ_INSTALLED=False

# Initialize script
echo "-- FCC Ubuntu Deployment Script --"

setup/db.sh
setup/ui.sh
setup/api.sh
setup/nginx.sh
