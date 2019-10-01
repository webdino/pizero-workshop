#!/bin/bash

set -eu

date
echo 'Start!'

if ! [ $(whoami) = root ]; then echo 'Root permission required.'; exit 1; fi

ScriptDir=$(cd $(dirname $BASH_SOURCE); pwd)
cd $ScriptDir
. env.sh

Origin=$ConfFile
ConfFile=$(mktemp)
# convert to UTF-8 LF & remove comment line & add line number
nkf -w -d < $Origin | sed s/^#.*$//g | awk '{print NR, $0}' > $ConfFile
RebootFlag=1

Ssh=default
Otg=default
SerialConsole=default
StaticIpAddress=default
StaticRooters=default
StaticDomainNameServers=default
Hostname=default

while read Line || [ -n "${Line}" ]; do
    set +e
    if(echo $Line | grep -q '^[0-9]*\s*$'); then : #empty line
    elif(echo $Line | grep -q '^[0-9]*\s*ssh:\s*enable\s*$'); then Ssh=0
    elif(echo $Line | grep -q '^[0-9]*\s*ssh:\s*disable\s*$'); then Ssh=1
    elif(echo $Line | grep -q '^[0-9]*\s*serial_console:\s*enable\s*$'); then SerialConsole=0
    elif(echo $Line | grep -q '^[0-9]*\s*serial_console:\s*disable\s*$'); then SerialConsole=1
    elif(echo $Line | grep -q '^[0-9]*\s*otg:\s*enable\s*$'); then Otg=0
    elif(echo $Line | grep -q '^[0-9]*\s*otg:\s*disable\s*$'); then Otg=1
    elif(echo $Line | grep -q '^[0-9]*\s*hostname:'); then
	Hostname=$(echo $Line | sed 's/^hostname:\s*\(.*\)\s*$/\1/g')
    elif(echo $Line | grep -q '^[0-9]*\s*static_ip_address:\s*[0-9\.\/]*\s*$'); then
	StaticIpAddress=$(echo $Line | sed 's/^[0-9]*\s*static_ip_address:\s*\(.*\)\s*$/\1/g')
    elif(echo $Line | grep -q '^[0-9]*\s*static_rooters:\s*[0-9\.\/]*\s*$'); then
	StaticRooters=$(echo $Line | sed 's/^[0-9]*\s*static_rooters:\s*\(.*\)\s*$/\1/g')
    elif(echo $Line | grep -q '^[0-9]*\s*static_domain_name_servers:\s*[0-9\.\/]*\s*$'); then
	StaticDomainNameServers=$(echo $Line | sed 's/^[0-9]*\s*static_domain_name_servers:\s*\(.*\)\s*$/\1/g')   
    else
	echo "'${Origin}'の$(echo $Line | cut -f 1 -d ' ')行目の読み込みでエラーが発生しました。" 1>&2
	exit 1
    fi
    set -e    
done < $ConfFile

SshOnOff () {
    if [ $Ssh != default ] && [ $Ssh != $(raspi-config nonint get_ssh) ];then
	echo 'change ssh setting ...'
	raspi-config nonint do_serial $Ssh
	RebootFlag=0
    fi    
}

SerialConsoleOnOff () {
    if [ $SerialConsole != default ] &&
	   ( [ $SerialConsole != $(raspi-config nonint get_serial) ] || 
		 [ $SerialConsole != $(raspi-config nonint get_serial_hw) ])
    then
	echo 'change serial console setting ...'
	raspi-config nonint do_serial $SerialConsole
	RebootFlag=0
    fi    
}

GetOtg(){
    if grep -q 'dtoverlay=dwc2' < '/boot/config.txt'; then
	if grep -q ' modules-load=dwc2,g_ether ' < '/boot/cmdline.txt'; then
	    return 0
	fi
    fi
    return 1
}
DoOtg(){
    if [ $1 = 0 ]; then
	if ! grep -q 'dtoverlay=dwc2' < '/boot/config.txt'; then
	    echo 'dtoverlay=dwc2' | tee -a '/boot/config.txt' > /dev/null
	fi
	if ! grep -q ' modules-load=dwc2,g_ether ' < '/boot/cmdline.txt'; then
	    sed -i 's/rootwait /rootwait modules-load=dwc2,g_ether /g' '/boot/cmdline.txt'
	fi
    else
	grep -v 'dtoverlay=dwc2' < '/boot/config.txt' > '/boot/config.txt'
	sed -i 's/rootwait modules-load=dwc2,g_ether /rootwait /g' '/boot/cmdline.txt'
    fi
}
OtgOnOff () {
    set +e
    if [ $Otg != default ]; then
	GetOtg
	if [ $? != $Otg ]; then
	    echo 'change otg setting ...'
	    DoOtg $Otg
	    RebootFlag=0
	fi
    fi
    set -e
}	   

DhcpcdInsert(){
    if ( [ $StaticIpAddress = default ] && [ $StaticRooters = default ] && [ $StaticDomainNameServers = default ]); then return 0; fi
    EtcDhcpcdConf='/etc/dhcpcd.conf'    
    Content=$(mktemp)
    Token=" # Inserted by bootPi"
    {
	echo "interface wlan0 $Token";
	if [ $StaticIpAddress != default ]; then
	    echo "static ip_address=${StaticIpAddress} $Token"
	fi
	if [ $StaticRooters != default ]; then
	    echo "static routers=${StaticRooters} $Token"
	fi
	if [ $StaticDomainNameServers != default ]; then
	    echo "static domain_name_servers=${StaticDomainNameServers} $Token"
	fi
    } >> $Content
    Temp=$(mktemp)
    cat $EtcDhcpcdConf | grep -v "$Token" > $Temp
    cat $Temp $Content > $EtcDhcpcdConf
    #cat $EtcDhcpcdConf # check
}

HostnameChange () {
    if [ $Hostname != default ]; then
	local NewHostname=$(echo $Hostname | grep '^[a-z0-9]\+\([a-z0-9\-]\)*\+[a-z0-9]$')
	if [ ! $? ]; then
	    echo 'Invalid hostname format(charactor).'
	    return 1
	fi
	if [ ${#NewHostname} -gt 255 ]; then
	    echo 'Invalid hostname format(too long).'
	    return 1
	fi
	if [ $NewHostname != $(hostname) ]; then
	    echo 'change hostname ...'
	    raspi-config nonint do_hostname $NewHostname
	    RebootFlag=0
	    return 0
	fi
	return 0
    else
	return 0
    fi
}

# block sequential reboot
if [ -f '.reboot' ]; then
    rm '.reboot'
    echo 'bootPi did nothing after rebooted by bootPi, finished.'
else
    SshOnOff
    OtgOnOff
    SerialConsoleOnOff
    DhcpcdInsert
    HostnameChange
    if [ $RebootFlag = 0 ]; then
	: > '.reboot'
	echo 'reboot ...'
	reboot
    fi
    echo 'Successfully finished.'
fi


