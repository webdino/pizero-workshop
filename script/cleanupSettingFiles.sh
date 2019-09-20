#!/bin/bash

if ! [ $(whoami) = root ]; then echo 'Error: root permission require. '; exit 1; fi

script_dir=$(cd $(dirname $BASH_SOURCE); pwd)

. $script_dir/env.sh

rm -rf $boot_dir/log/*
rm -rf $dir/log/*

echo -n raspberrypi | tee $boot_dir/hostname.conf > /dev/null

cat <<EOF | tee $boot_dir/rclone.conf > /dev/null
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
chown pi:pi $boot_dir/rclone.txt

cat <<EOF | tee $dir/config.js | tee $boot_dir/config.js > /dev/null
//  Format Sample 
/*
Multiple wifi spots are available. (higer line, higher priority)
Following are the sample of 3 wifi spots, ssid1 has most highest priority.
*/
/*
wifi:
[
  {ssid: "ssid1", passphrase: "pass111111111"}
  ,
  {ssid: "ssid2", passphrase: "pass1111\"111111"}
  ,
  {ssid: "ss\"id3", passphrase: "pass1111\"111111"}
]
*/

module.exports = {
  wifi:   
  [
    {ssid: "", passphrase: ""}
    ,
    {ssid: "", passphrase: ""}
  ]
  ,
  omron2jcieBu01_Csv_Machinist:
  [
    {
      intervalMillisec: 60000
      omron2jcieBu01Name: "Rbt",
      omron2jcieBu01Address: "",
      csvFilename: "",
      machinistApikey: "",
      machinistAgent: "",
      machinistMultiple: 1,
    }
    ,
    {
      intervalMillisec: 60000
      omron2jcieBu01Name: "Rbt",
      omron2jcieBu01Address: "",
      csvFilename: "",
      machinistApikey: "",
      machinistAgent: "",
      machinistMultiple: 1,
    }
  ]
}
EOF

cat <<EOF | tee /etc/wpa_supplicant/wpa_supplicant.conf > /dev/null
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=JP

EOF

chown pi:pi $dir/config.js

#{ pushd /home/pi/; [ -f .emacs ] && rm .emacs; [ -f .emacs~ ] && rm .emacs~; popd; } > /dev/null

set -o history
history -c
su - pi <<EOF
set -o history
history -c	
EOF
cat /dev/null > /home/pi/.bash_history

echo 'Successfully done.'
