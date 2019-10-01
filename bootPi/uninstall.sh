#!/bin/bash

set -eu

echo 'uninstall bootPi ...'

ScriptDir=$(cd $(dirname $BASH_SOURCE); pwd)
cd $ScriptDir
. env.sh

systemctl disable bootPi
rm -f /etc/systemd/system/bootPi.service
systemctl daemon-reload

echo 'Successfully done.'


