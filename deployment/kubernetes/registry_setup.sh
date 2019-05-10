#!/bin/sh
read -p "Enter Registry Address: " reg_address
sed -i '' -e 's@<<registry-address>>@'$reg_address'@g' ./db.yaml
sed -i '' -e 's@<<registry-address>>@'$reg_address'@g' ./api.yaml
sed -i '' -e 's@<<registry-address>>@'$reg_address'@g' ./ui.yaml
