#!/bin/bash

set -eu

date

if ! [ $(whoami) = root ]; then echo 'Root permission required.'; exit 1; fi

. env.sh

ScriptDir=$(cd $(dirname $BASH_SOURCE); pwd)
OriginalConfigJs="${BootDir}/config.js"
ConfigJs=$(mktemp)
CheckConfig="${Dir}/checkConfig.js"

echo "Convert '$OriginalConfigJs' to (UTF-8 LF) ..."
nkf -w -d  < $OriginalConfigJs > $ConfigJs

echo 'syntax ...'
node -c $ConfigJs

echo 'value ...'
node $CheckConfig $ConfigJs

echo 'ping ...'
while :; do
    ping webdino.org -c 1 > /dev/null
    if [ $? = 0 ]; then break; fi
    sleep 10
done
echo 'ping ok.'
echo 'Restart systemd-timesyncd ... '
systemctl restart systemd-timesyncd

#sleep 10
echo 'Start main service (sensing and records) ... ' 
systemctl start pizero-workshop

echo 'All start process successfully finished.'
exit 0
