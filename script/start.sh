#!/bin/bash

set -eu

date 

script_dir=$(cd $(dirname $BASH_SOURCE); pwd)
. $script_dir/env.sh

if ! [ $(whoami) = root ]; then echo 'Root permission required.'; exit 1; fi

# initialize
#ConfigFile='./config.js'
ConfigFile="$boot_dir/config.js"
CheckConfig="$dir/script/checkConfig.js"
ConfigTemp=$(mktemp)
GenerateLogrotate="$dir/script/generateLogrotate.js"
GenerateWpaPassphraseCommandJs="$dir/script/generateWpaPassphraseCommand.js"
WpaSupplicantConf='/etc/wpa_supplicant/wpa_supplicant.conf'

set +e
. beforeStart.sh
set -e

# convert Config to ConfigTemp(UTF-8 LF)
echo 'Convert config.js to (UTF-8 LF) ...'
nkf -w -d  < $ConfigFile > $ConfigTemp
result=$?
cat $ConfigTemp 
[ $result = 0 ] || exit 1


# check node -c ConfigTemp
echo 'Check config.js (syntax) ...'
$Node -c $ConfigTemp
[ $? = 0 ] || exit 1


# check, must property , value, omron2jcie address format, 
echo 'Check config.js (value) ...'
$Node $CheckConfig $ConfigTemp
[ $? = 0 ] || exit 1


# generate logrotate
echo 'GenerateLogrotate ...'
LogrotateContent=$($Node $GenerateLogrotate $ConfigTemp $dir)
result=$?
[ $result = 0 ] || exit 1
echo $LogrotateContent > $Logrotate


# generate command(wpa_passphrase)
echo 'GenerateWpaPassphrase ...'
WpaPassphrase=$($Node $GenerateWpaPassphraseCommandJs $ConfigTemp)
result=$?
#echo $WpaPassphrase
[ $result = 0 ] || exit 1


# wpa_passphrase(genarated)
echo 'WpaPassphrase ...'
WpaList=$(eval $WpaPassphrase)
result=$?
#echo $WpaList 
[ $result = 0 ] || exit 1


# wpa_supplicant.conf
cat <<EOF > $WpaSupplicantConf 
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=JP
$WpaList
EOF
echo "Result of '$WpaSupplicantConf' is ..." 
cat $WpaSupplicantConf 


# wifi, ping, timesyncd, sensing loop
sudo killall wpa_supplicant
echo 'start wlan0 ...'
sudo su -c 'wpa_supplicant -B -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf'
sudo /sbin/iw dev wlan0 set power_save off
sleep 5
echo 'scan wlan0 ...'
#sudo iwlist wlan0 scan | grep 'ESSID'

#ifconfig wlan0
#systemctl stop pizero-workshop #systemctl disable pizero-workshop
echo 'ping ...'
set +e
while :; do
    ping webdino.org -c 1 > /dev/null
    if [ $? = 0 ]; then break; fi
    sleep 10
done
echo 'ping ok.'
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

echo 'All start process successfully finished.'; exit 0
