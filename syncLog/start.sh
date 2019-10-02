#!/bin/bash

set -eu

date
echo 'Start!'

if ! [ $(whoami) = root ]; then echo 'Root permission required.'; exit 1; fi

ScriptDir=$(cd $(dirname $BASH_SOURCE); pwd)
cd $ScriptDir;
. env.sh
Origin=$ConfigFile
ConfigFile=$(mktemp)

# UTF-8 LF convert config.js 
echo -n "Convert '$Origin' to (UTF-8 LF) ... "
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
