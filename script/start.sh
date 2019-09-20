#!/bin/bash

set -eu

script_dir=$(cd $(dirname $BASH_SOURCE); pwd)
. $script_dir/env.sh

#if ! [ $(whoami) = root ]; then echo 'Root permission required.'; exit 1; fi

# initialize
ConfigFile='./config.js'
#ConfigFile="$boot_dir/config.js"
ConfigTemp=$(mktemp)
GenarateWpaPassphraseCommandJs='genarateWpaPassphraseCommand.js'
WpaSupplicantConf='wpa_supplicant.conf'
#WpaSupplicantConf='/etc/wpa_supplicant/wpa_supplicant.conf'
CheckConfig='checkConfig.js'

# . beforeStart.sh

# convert Config to ConfigTemp(UTF-8 LF)
echo 'Convert config.js to (UTF-8 LF)...'
nkf -w -d  < $ConfigFile > $ConfigTemp
result=$?
cat $ConfigTemp 
[ $result = 0 ] || exit 1


# check node -c ConfigTemp
echo 'Check config.js (grammer)...'
node -c $ConfigTemp
[ $? = 0] || exit 1


# check, must property , value, omron2jcie address format, 
echo 'Check config.js (value)...'
node $CheckConfig $ConfigTemp
[ $? = 0 ] || exit 1


# generate command(wpa_passphrase)
echo 'GenerateWpaPassphrase ...'
WpaPassphrase=$(node $GenerateWpaPassphraseCommandJs $ConfigTemp)
result=$?
cat $WpaPassphrase
[ $result = 0 ] || exit 1


# wpa_passphrase(genarated)
echo 'WpaPassphrase ...'
WpaList=$(eval $WpaPassphrase)
result=$?
echo $WpaList 
[ $result = 0 ] || exit 1


# wpa_supplicant.conf
cat <<EOF > $WpaSupplicantConf 
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=JP
$WpaList
EOF
echo 'Result of wpa_supplicant.conf is ...' 
cat $WpaSupplicantConf 


# wifi, ping, timesyncd, sensing loop
sudo killall wpa_supplicant
sudo su -c 'wpa_supplicant -B -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf'
sudo /sbin/iw dev wlan0 set power_save off
if [ $(sudo iwlist wlan0 scan | grep $ssid) ]; then
    echo "wifi ${ssid} is found."
else
    echo "warning: wifi ${ssid} is not found."
    #exit 1
fi
#ifconfig wlan0
#systemctl stop pizero-workshop #systemctl disable pizero-workshop
echo 'Start ping... '
while :; do
    ping webdino.org -c 1 >> /dev/null #/home/pi/ping_status
    if [ $? = 0 ]; then break; fi
    sleep 10
done
echo 'Restart systemd-timesyncd ... '
systemctl restart systemd-timesyncd
result=$?
[ $result = 0 ] || exit 1
#sleep 10
echo 'Start sensing loop ... ' 
systemctl start pizero-workshop
echo 'Start rsync ... ' 
$Rclone
echo 'Start rclone ... ' 
$Rsync
