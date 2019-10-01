#!/bin/bash

set -eu

echo 'uninstall syncLog ...'

if ! [ $(whoami) = root ]; then echo 'Error: root permission required.'; exit 1; fi

ScriptDir=$(cd $(dirname $BASH_SOURCE); pwd)
cd $ScriptDir
. env.sh

# systemd
systemctl disable syncLog
rm -f /etc/systemd/system/syncLog.service
systemctl daemon-reload

echo 'Successfully done.'
