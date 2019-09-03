#!/bin/bash

if ! [ $(whoami) = root ]; then echo 'Error: root permission require. '; exit 1; fi

script_dir=$(cd $(dirname $BASH_SOURCE); pwd)

. $script_dir/env.sh

#rm -rf /boot/setting/log/*
#rm -rf /home/pi/bird/log/*
rm -rf $boot_dir/log/*
rm -rf $dir/log/*

#rm $boot_dir/wifi.txt; sudo touch $boot_dir/wifi.txt;
: > $boot_dir/wifi.txt
echo -n raspberrypi | tee $boot_dir/hostname.txt > /dev/null

#cat <<EOF | tee /home/pi/bird/setting/rclone.txt | tee /boot/setting/rclone.txt > /dev/null
cat <<EOF | tee $dir/setting/rclone.txt | tee $boot_dir/rclone.txt > /dev/null
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

chown pi:pi $dir/setting/rclone.txt

cat <<EOF | tee $dir/config.js | tee $boot_dir/config.js > /dev/null
module.exports = {
  "NAME": "Rbt",
  "ADDRESS": "",
  "INTERVAL_MILLISEC": 60000,
  "RECORDS": ["CSV", "MACHINIST"],
  //"RECORDS": ["CSV", "AMBIENT"]
  //"RECORDS": ["CSV", "MACHINIST", "AMBIENT],
  "MACHINIST_API_KEY": "",
  "MACHINIST_MULTIPLE": 1
  //"AMBIENT_CHANNEL": ,
  //"AMBIENT_WRITE_KEY": "",
  //"AMBIENT_MULTIPLE": 1
};
EOF

chown pi:pi $dir/config.js

#{ pushd /home/pi/; [ -f .emacs ] && rm .emacs; [ -f .emacs~ ] && rm .emacs~; popd; } > /dev/null
history -c
cat /dev/null > /home/pi/.bash_history

echo 'Successfully done.'
