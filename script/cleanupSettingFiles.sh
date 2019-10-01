#!/bin/bash

if ! [ $(whoami) = root ]; then echo 'Error: root permission require. '; exit 1; fi

ScriptDir=$(cd $(dirname $BASH_SOURCE); pwd)

. ../env.sh

rm -rf $BootDir/log/*
rm -rf $Dir/log/*

cat <<EOF | tee $BootDir/rclone.conf > /dev/null
[gdrive]
type = drive
client_id = 
client_secret = 
token = {
"access_token": "",
"token_type": "Bearer",
"refresh_token": "",
"expiry": ""
}
EOF

(cd "${Dir}"; ./install.sh -installFiles)
(cd "${Dir}/syncLog"; ./install.sh)
(cd "${Dir}/bootWifi"; ./install.sh)
(cd "${Dir}/bootPi"; ./install.sh)

rm $BootDir/config.js

cat <<EOF | tee /etc/wpa_supplicant/wpa_supplicant.conf > /dev/null
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=JP

EOF

set -o history
history -c
su - pi <<EOF
set -o history
history -c	
EOF
cat /dev/null > /home/pi/.bash_history

echo 'Successfully done.'
