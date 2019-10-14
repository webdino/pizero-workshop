#!/bin/bash

# This shell script is called by syncLog.service (systemd). #
# And output will be redirected to status file #

set -eu

echo -n 'Started at '
date

if ! [ $(whoami) = root ]; then echo 'Root permission required.'; exit 1; fi

ScriptDir=$(cd $(dirname $BASH_SOURCE); pwd)
cd $ScriptDir;
. env.sh
Origin=$ConfigFile
ConfigFile=$(mktemp)

echo "Using Following config file:$Origin ... "
cat $Origin

# UTF-8 LF convert config.js #
echo -n "Converting '$Origin' to UTF-8 LF ... "
ConfigJs=$(mktemp)
nkf -w -d  < $Origin > $ConfigFile
echo 'ok.'
#cat $ConfigJs 

echo -n 'syntax ... '
node -c $ConfigFile
echo 'ok.'

echo -n 'value ... '
node $CheckConfig $ConfigFile
echo 'ok.'

echo 'Start!'
node syncLog.js $ConfigFile
