#!/bin/bash

if ! [ $(whoami) = root ]; then echo 'Error: root permission require. '; exit 1; fi

ScriptDir=$(cd $(dirname $BASH_SOURCE); pwd)
cd $ScriptDir
. ../env.sh

systemctl stop syncLog
systemctl stop pizero-workshop

(cd "${Dir}/bootPi"; pwd; ./install.sh -i; ./install.sh -y;)
(cd "${Dir}/bootWifi"; pwd; ./install.sh -i; ./install.sh -y;)
(cd "${Dir}/syncLog"; pwd; ./install.sh -i; ./install.sh -y;)

(cd "${Dir}"; ./install.sh -initConfigJs;)

echo 'Successfully done.'
