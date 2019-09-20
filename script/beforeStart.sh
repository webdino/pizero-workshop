#!/bin/bash

RebootFlag=1

Ssh () {
    if [ -z $SshFile ]; then _ssh='enable'; else _ssh='disable'; fi
    local Current
    _current=$(systemctl list-unit-files --type service | grep ssh.service | awk '{print $2}')
    [ $_ssh = 'enable' ] && [ $Current = 'disabled' ] && systemctl enable ssh && $RebootFlag=0
    [ $_ssh = 'disable' ] && [ $Current = 'enabled' ] && systemctl disable ssh && $RebootFlag=0
}

Otg () {
    if [ -z $OtgFile ]; then _ssh='enable'; else _ssh='disable'; fi
    local Current
    _current=$(grep -q 'dtoverlay=dwc2' '/boot/config.txt')
    if [ $otg = 'enable' ] && ( ! $Current ); then
	echo 'dtoverlay=dwc2' | tee -a '/boot/config.txt'
	sed -i 's/rootwait /rootwait modules-load=dwc2,g_ether /g' '/boot/cmdline.txt'
	$RebootFlag=0
    fi
    if [ $otg = 'diseble' ] && $Current; then
	grep -v 'dtoverlay=dwc2' > '/boot/config.txt'
	sed -i 's/rootwait modules-load=dwc2,g_ether /rootwait /g' '/boot/cmdline.txt'
	$RebootFlag=0
    fi
}

# SerialConsole () {
#     if [ -z $SerialConsoleFile ]; then _ssh='enable'; else _ssh='disable'; fi
#     local _current
#     _current=$(grep -q 'dtoverlay=dwc2' '/boot/config.txt')
#     if [ $otg = 'enable' ] && ( ! $_current ); then
# 	echo 'dtoverlay=dwc2' | tee -a '/boot/config.txt'
#           core_freq=250
# 	sed -i 's/rootwait /rootwait modules-load=dwc2,g_ether /g' '/boot/cmdline.txt'
#	    g_serial   console=serial0,115200 console=tty`

# 	echo 'true' > $_reboot
#     fi
#     if [ $otg = 'diseble' ] && $_current; then
# 	grep -v 'dtoverlay=dwc2' > '/boot/config.txt'
#           core_freq=250
# 	sed -i 's/rootwait modules-load=dwc2,g_ether /rootwait /g' '/boot/cmdline.txt'
#	    g_serial   console=serial0,115200 console=tty`
# 	echo 'true' > $_reboot
#     fi
# }

Hostname () {
    if ! [ -f $HostnameConf ]; then return 0; fi
    local CommentRemoved=$(cat $HostnameConf |sed s/^#.*$//g)
    if [ 1 -ne $(echo $CommentRemoved | wc -w) ]; then
	echo 'hostname.conf has invalid form.'
	return 1
    fi
    local NewHostname=$(echo $CommentRemoved | grep '^[a-z0-9]\+\([a-z0-9]\|[a-z0-9\-][a-z0-9]\)*$')
    if [ ! $? ]; then
	echo 'Invalid hostname format.'
	return 1
    fi
    if [ ${#NewHostname} -gt 255 ]; then return 1; fi
    if [ $NewHostname != $(hostname) ]; then
	#raspi-config nonint do_hostname $CurrentHostname
	RebootFlag=0
    fi
    return 0
}

# block sequential reboot
if [ -f '.reboot' ]; then
    rm '.reboot'
else
    $Ssh
    $Otg
    $Hostname
    if [ $RebootFlag ]; then
	: > '.reboot'
	#reboot
    fi
fi
