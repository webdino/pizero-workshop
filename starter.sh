#!/bin/bash

# This shell script is called by cron when reboot.
# And this shell script start pizero-workshop.service (systemd).

set -eu

echo -n 'Started at '
date

if ! [ $(whoami) = root ]; then echo 'Root permission required.'; exit 1; fi

. env.sh

ScriptDir=$(cd $(dirname $BASH_SOURCE); pwd)
Origin="${BootDir}/config.js"
ConfigJs=$(mktemp)
CheckConfig="${Dir}/checkConfig.js"

if [ -f $Origin ]; then
    echo "Using Following config file:$Origin ... "
    cat $Origin

    echo "Converting '$Origin' to UTF-8 LF ... "
    nkf -w -d  < $Origin > $ConfigJs
    echo "ok"
    
    echo -n 'syntax ... '
    node -c $ConfigJs
    echo 'ok'
    
    echo 'value ... '
    node $CheckConfig $ConfigJs
    echo 'ok'
else
    echo "$Origin is not found, may be using ${Dir}/setting/config.js ."
fi

set +e
echo -n 'ping ... '
while :; do
    ping webdino.org -c 1 > /dev/null 2>&1
    if [ $? = 0 ]; then break; fi
    sleep 10
done
echo 'ok'

echo 'Restart systemd-timesyncd ... '
systemctl restart systemd-timesyncd
echo 'ok'

echo 'Start sensing and records ... '
systemctl start pizero-workshop
echo 'ok'

echo 'All start process finished.'
exit 0
