#!/bin/bash

set -eu

date

if ! [ $(whoami) = root ]; then echo 'Root permission required.'; exit 1; fi

ScriptDir=$(cd $(dirname $BASH_SOURCE); pwd)
cd $ScriptDir
. env.sh

WpaSupplicantConf='/etc/wpa_supplicant/wpa_supplicant.conf'
CheckConfig="${ScriptDir}/checkConfig.js"
GenerateWpaPassphraseCommandJs="${ScriptDir}/generateWpaPassphraseCommand.js"
Origin=$ConfigFile
ConfigFile=$(mktemp)

if ! [ -f $Origin ]; then echo "'$Origin' is not found, finished."; exit 0; fi

# UTF-8 LF convert config.js 
echo -n "Convert '$Origin' to (UTF-8 LF) ... "
nkf -w -d  < $Origin > $ConfigFile
echo 'ok.'
cat $ConfigFile 

echo -n 'syntax ... '
node -c $ConfigFile
echo 'ok.'

echo -n 'value ... '
node $CheckConfig $ConfigFile
echo 'ok.'

# generate command(wpa_passphrase)
echo 'GenerateWpaPassphrase ...'
WpaPassphrase=$(node $GenerateWpaPassphraseCommandJs $ConfigFile)
echo $WpaPassphrase
if [ ${#WpaPassphrase} = 0 ]; then
    echo "Wifi setting in '$Origin' is empty, and not modfiy '$WpaSupplicantConf', finished."
    exit 0;
fi

# wpa_passphrase(genarated)
echo 'WpaPassphrase ...'
WpaList=$(eval $WpaPassphrase)
echo $WpaList 

# wpa_supplicant.conf
cat <<EOF > $WpaSupplicantConf 
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=JP
$WpaList
EOF
echo "Result of '$WpaSupplicantConf' is ..." 
cat $WpaSupplicantConf 

sudo killall wpa_supplicant
echo 'start wlan0 ...'
sudo su -c 'wpa_supplicant -B -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf'

sudo /sbin/iw dev wlan0 set power_save off
sleep 5
echo 'scan wlan0 ...'
set +e
sudo iwlist wlan0 scan | grep 'ESSID'

#ifconfig wlan0
echo -n 'ping ...'
while :; do
    ping webdino.org -c 1 > /dev/null
    if [ $? = 0 ]; then break; fi
    sleep 10
done
echo 'ping ok.'

echo 'wifi start process successfully finished.'; exit 0
