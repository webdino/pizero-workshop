#!/bin/bash

set -eu

echo 'install bootWifi ...'

if ! [ $(whoami) = root ]; then echo 'Root permission required.'; exit 1; fi

ScriptDir=$(cd $(dirname $BASH_SOURCE); pwd)
. env.sh

systemctl disable bootWifi
rm -f /etc/systemd/system/bootWifi.service
systemctl daemon-reload

echo 'Successfully done.'
