#!/bin/sh
read -p "Enter API IP-Address: " api_address
sed -i '' -e 's@<<api-address>>@'$api_address'@g' ../../Frontend/fcc.config.js
sed -i '' -e 's@<<api-address>>@'$api_address'@g' ../../Frontend/src/api/axios.js
sed -i '' -e 's@<<api-address>>@'$api_address'@g' ../../Frontend/src/api/urls.js
