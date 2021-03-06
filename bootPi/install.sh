#!/bin/bash

# This shell script is executed by a user manually or another auto installer programs. #

set -eu

if ! [ $(whoami) = root ]; then echo 'Root permission required.'; exit 1; fi

ScriptDir=$(cd $(dirname $BASH_SOURCE); pwd)
cd $ScriptDir

# display command options #
if [ $# -gt 0 ] && [ "$1" = '-h' ] ; then
cat <<EOF

- install without any options (default)

- install with following options
   -y (skip confirm (force overwrite if config file is already exists))
   -s filepath (status log file path (default ./status.txt)
   -c filepath (config file path (default ./bootPi.conf)

- initialize
   -i initialize (set defalut) env.sh (StatusFile="status.txt" , ConfigFile="bootPi.conf")

EOF
exit 0
fi

ForceOverwite='no'
while getopts "yis:c:" op
do
    case $op in
        y)
            ForceOverwite='yes'
            ;;
	s)
	    # modify the value of StatusFile in env.sh #
            StatusFile="$OPTARG"
	    sed -i "/^StatusFile=/d" env.sh
	    echo "StatusFile=\"$StatusFile\"" >> env.sh
            ;;
        c)
	    # modify the value of ConfigFile in env.sh #
            ConfigFile="$OPTARG"
	    sed -i '/^ConfigFile=/d' env.sh
	    echo "ConfigFile=\"$ConfigFile\"" >> env.sh
            ;;
	i)
	    # initialize env.sh #
	    cat <<EOF > env.sh
#!/bin/bash

# This shell script is called by install.sh, uninstall.sh, bootWifi.sh. 
# And generated and modifid by executing install.sh with c,s,i options

Script="bootPi.sh"
ConfigFile="bootPi.conf"
StatusFile="status.txt"
EOF
	    echo "Initialized env.sh, done."
	    . env.sh
	    [ -f $StatusFile ] && rm $StatusFile
	    exit 0
	    ;;
        *)
	    exit 1
            ;;
    esac
done

. env.sh

echo 'install bootPi ...'

ConfigFileWrite(){
    cat <<EOF > $ConfigFile
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

# for interaction #
if [ -f $ConfigFile ] && [ $ForceOverwite != 'yes' ] ; then
    echo "Setting file:${ConfigFile} is already exist, overwrite? (yes|no)"
    echo -n "> "
    read ForceOverwite
    case $ForceOverwite in
	yes)
	    ConfigFileWrite
	    ;;
	no)
	    :
	    ;;
	*)
	    echo -e "Cannot understand '$ForceOverwite'.\nInstall fail."
	    exit 1
            ;;
    esac
else ConfigFileWrite; fi

# install depend packages #
which nkf > /dev/null || apt install -y nkf

# create systemd service #
cat <<EOF > /etc/systemd/system/bootPi.service
[Unit]
Description=bootPi
After=syslog.target network.target

[Service]
Type=simple
WorkingDirectory=$ScriptDir
ExecStart=/bin/bash -c ": > $StatusFile; ./$Script > $StatusFile 2>&1"
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

Please edit setting file:$ConfigFile , and execute following command.

'sudo systemctl enable bootPi'
'sudo systemctl start bootPi'

EOF
