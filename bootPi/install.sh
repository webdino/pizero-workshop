#!/bin/bash

set -eu

echo 'install bootPi ...'

if ! [ $(whoami) = root ]; then echo 'Root permission required.'; exit 1; fi

ScriptDir=$(cd $(dirname $BASH_SOURCE); pwd)
cd $ScriptDir
. env.sh

ConfFileWrite(){
    cat <<EOF > $ConfFile
# This is bootPi setting file.
#
# Comment line is available only with line head # charactor.
#
# Setting is a collection of directive and value with semicolon separation.
#
# ssh, otg, serial_console (these are enable or disable.)
# ssh (enable|disable)
# otg (enable|disable)
# serial_console (enable|disable)
#
# static_ip_address, static_rooters, static_domain_name_servers (these are will be into /etc/dhcpcd.conf .)
# static_ip_address (ip address)
# static_rooters (ip address)
# static_domain_name_servers (ip address)
#
# hostname (first and last charactors are only 0-9 or a-z, others are 0-9 or a-z or -(hiphen).)
#
# Followings are example of setting.

#ssh: enable
#ssh: disable
#otg: enable
#otg: disable
#serial_console: enable
#serial_console: disable
#static_ip_address: 192.168.0.2/24
#static_rooters: 192.168.0.1
#static_domain_name_servers: 192.168.0.1
#hostname: raspberrypi
EOF
}
	   
if [ -f $ConfFile ]; then
    echo "Setting file:${ConfFile} is already exist, overwrite? (yes|no)"
    echo -n "> "
    read Answer
    case $Answer in
	yes)
	    ConfFileWrite
	    ;;
	no)
	    :
	    ;;
	*)
	    echo -e "Cannot understand $Answer.\nInstall fail."
	    exit 1
            ;;
    esac
else ConfFileWrite; fi
   
which nkf > /dev/null || apt install -y nkf

cat <<EOF > /etc/systemd/system/bootPi.service
[Unit]
Description=bootPi
After=syslog.target network.target

[Service]
Type=simple
WorkingDirectory=$ScriptDir
ExecStart=/bin/bash -c "./$Script > $Status 2>&1"
User=root
Group=root
StandardOutput=journal
StandardError=journal

[Install]
WantedBy = multi-user.target

EOF

systemctl daemon-reload
#systemctl enable bootPi

cat <<EOF

Installed successfully.

Please edit setting file:$ConfFile , and execute following command.

'sudo systemctl enable bootPi'
'sudo systemctl start bootPi'

EOF
