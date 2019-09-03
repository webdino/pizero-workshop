#!/bin/bash

#set -eu

if ! [ $(whoami) = root ]; then echo 'Root permission required.'; exit 1; fi

systemctl stop pizero-workshop
systemctl disable pizero-workshop

function check () {
    while :; do
	ping webdino.org -c 1 >> /dev/null
	#ping webdino.org -c 1 >> /home/pi/ping_status
	if [ $? -eq 0 ]; then return 0; fi
	sleep 10
    done
}

#echo 'Waiting ping... ' $(date) >> /home/pi/ping_status
check

#echo 'Waiting ntp sunc... '
systemctl restart systemd-timesyncd
# /etc/init.d/ntpd stop
# ntpdate time.asia.apple.com
# /etc/init.d/ntpd start
#sleep 10

#echo 'OK, start. ' $(date) >> /home/pi/ping_status
systemctl start pizero-workshop
