#!/bin/bash

set -eu

if ! [ $(whoami) = root ]; then echo 'Error: root permission required.'; exit 1; fi

ScriptDir=$(cd $(dirname $BASH_SOURCE); pwd)

. env.sh

Cron="${BootDir}/cron"
Logrotate="${BootDir}/logrotate"
Starter="$Dir/starter.sh"
Node='/home/pi/.nodebrew/current/bin/node'
Npm='/home/pi/.nodebrew/current/bin/npm'
Error="${Dir}/log/error.txt"
StarterStatus="${BootDir}/starterStatus.txt"
ConfigJs="${Dir}/setting/config.js"

setupTimezone () {
    echo -n 'Setup timezone... '
    timedatectl set-timezone Asia/Tokyo
    timedatectl | grep 'Time zone:' | xargs
}

extendSwap () {
    local swap_file='/etc/dphys-swapfile'
    if grep -q '^CONF_SWAPSIZE=' $swap_file; then
	sed -i 's/^CONF_SWAPSIZE=.*/CONF_SWAPSIZE=1024/g' $swap_file
    else
	echo 'CONF_SWAPSIZE=1024' >> $swap_file
    fi
    systemctl stop dphys-swapfile
    echo -n 'Resize swap area to 1.0G now... '
    systemctl start dphys-swapfile
    [ '1.0Gi' = $(free -h | grep 'Swap:' | awk '{print $2}') ] && echo 'done.' || echo "warning: Swap area size is not 1.0G"
}

setupLocale (){
    echo -n "Setup locale... "
    if locale | grep "LANG=ja_JP\.UTF-8"; then
	echo "Already locale 'LANG=ja_JP.UTF-8' exists, Ok."
	return 0
    else
	local file='/etc/locale.gen'
	grep ^[^#] $file | while read _LINE; do sed -i "s/${_LINE}/\# ${_LINE}/" $file; done
	sed -i 's/^# ja_JP.UTF-8/ja_JP.UTF-8/g' $file
	sed -i 's/^# ja_JP.EUC-JP/ja_JP.EUC-JP/g' $file
	sed -i 's/^# en_US.UTF-8/en_US.UTF-8/g' $file
	locale-gen
	update-locale LANG=ja_JP.UTF-8
	echo "Setup locale is done."
	echo 'Please reboot before next setup (Recommend).'
    fi
}

installFirst () {
    setupTimezone
    extendSwap
    setupLocale
    sudo raspi-config nonint do_wifi_country JP
    # sudo raspi-config nonint do_expand_rootfs
    echo 'Successfully done.'
}

installNode () {
    which node > /dev/null || apt install -y nodejs
    which npm > /dev/null || apt install -y npm
    su - pi <<EOF
    if [ -f $Node ] && [ \$($Node -v) = 'v8.15.0' ]; then
	echo 'Already exist node v8.15.0 in nodebrew, Ok.'
	exit 0;
    else
	echo -n 'Install node v8.15.0 from nodebrew ... '
	if ! [ "$(which nodebrew)" ]; then curl -L git.io/nodebrew | perl - setup; fi
        export PATH=/home/pi/.nodebrew/current/bin:\$PATH		   
	nodebrew ls-all
	nodebrew install v8.15.0
	nodebrew use v8.15.0
    fi
EOF
    echo 'Successfully done.'
}

installNpmPackage () {
    apt install -y bluetooth bluez libbluetooth-dev libudev-dev
    su - pi <<EOF
    export PATH=/home/pi/.nodebrew/current/bin:\$PATH
    echo -n "Install npm package... "
    cd "$Dir"
    $Npm i
    if [ \$? = 0 ]; then echo "Done."; else "Warning: installNpmPackage fail."; fi
EOF
    echo 'Successfully done.'
}

installAptPackage () {
    which nkf > /dev/null || apt install -y nkf
    which node > /dev/null || apt install -y nodejs
    apt install -y libcap2-bin
    # setcap cap_net_raw+eip $(eval readlink -f `which node`)
    setcap cap_net_raw+eip /home/pi/.nodebrew/current/bin/node
    echo 'Successfully done.'
}

installFiles () {
    [ -d "$Dir/log" ] || mkdir "$Dir/log"
    [ -d "$BootDir" ] || sudo mkdir "$BootDir"
    
    cat <<EOF > $Logrotate
$Dir/log/*.csv {
	weekly
	dateext
	dateformat %Y%m%d
	rotate 100
	missingok
	nocompress
	ifempty
	create 0640 pi pi
}

EOF
    # : > $Logrotate
    ln -fs $Logrotate /etc/logrotate.d/pizero-workshop 

    # cron
    cat <<EOF > $Cron
SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

@reboot	       root bash -c "systemctl start bootPi > $StarterStatus 2>&1"
@reboot	       root bash -c "systemctl start bootWifi > $StarterStatus 2>&1"
@reboot	       root bash -c "systemctl start syncLog > $StarterStatus 2>&1"
@reboot	       root bash -c "cd $Dir; $Starter > $StarterStatus 2>&1"
#*/1 * * * *    pi bash -c "$Dir/traffic.sh >> $Dir/log/traffic.csv"

EOF
    ln -fs $Cron /etc/cron.d/pizero-workshop 
    
    # systemd
    cat <<EOF > /etc/systemd/system/pizero-workshop.service
[Unit]
Description=pizero-workshop
After=syslog.target network.target

[Service]
Type=simple
WorkingDirectory=$Dir
ExecStart=/bin/bash -c "cd $Dir; NODE_PATH=lib $Node pizero-workshop.js 2>> $Error"
TimeoutStopSec=5
Restart=always
User=root
Group=root
StandardOutput=journal
StandardError=journal

[Install]
WantedBy = multi-user.target

EOF

    [ -d /home/pi/Desktop ] && ln -nfs /boot/setting /home/pi/Desktop/setting
    systemctl disable pizero-workshop #systemctl enable pizero-workshop
    systemctl daemon-reload


    cat <<EOF > $ConfigJs
/*
Following is a sample of pizero-workshop config.js.
Plearse export the array of setting object (sensing and record interval time, sensor info, csv file path, machinist acount info, ambient acount info).

//sample setting object of sensing and record to csv, machinist, ambient 
const setting1 =   {
  intervalMillisec: 60000    //sensing and record interval (milli second)
  omron2jcieBu01Name: "Rbt", //maybe fix "Rbt"
  omron2jcieBu01Address: "", //12 charactors of number or aphabet (like "A1B2C3D4E5F6")
  csvFilename: "",           //csv file path for saving sensing data
  machinistApikey: "",       //from machinist acount
  machinistAgent: "",        //from machinist acount
  machinistBatchQuantity: 1, //temporary stock number of sensing data before sending
  ambinetChannelId: 0,       //from ambient acount (number)
  ambientWriteKey: "",       //from ambient acount
  ambietnBatchQuantity: 1    //temporary stock number of sensing data before sending
}

//sample setting object of sensing and record to machinist
const machinist =   {
  intervalMillisec: 60000
  omron2jcieBu01Name: "Rbt",
  omron2jcieBu01Address: "", 
  machinistApikey: "",       
  machinistAgent: "",        
  machinistBatchQuantity: 1
}

//sample setting object of sensing and record to csv, ambient
const ambientAndCsv =   {
  intervalMillisec: 60000
  omron2jcieBu01Name: "Rbt",
  omron2jcieBu01Address: "", 
  csvFilename: "",
  ambinetChannelId: 0,     
  ambientWriteKey: "",     
  ambietnBatchQuantity: 1  
}

//sample setting object of sensing and record to csv
const csvOnly =   {
  intervalMillisec: 60000
  omron2jcieBu01Name: "Rbt",
  omron2jcieBu01Address: "",
  csvFilename: ""
}

//must exports array of each setting object like this.
module.exports = [setting1, machinistAndCsv, csvOnly];

*/

module.exports = [

];
EOF
    chown pi:pi $ConfigJs
    
    echo 'Successfully done.'
}


showOptions () {
    cat <<EOF

OPTIONS
   -installFirst	
   -installNode
   -installNpmPackage
   -installAptPackage
   -installFiles

EOF
}

if [ $# -gt 0 ]; then
    case "$1" in
	-installFirst) installFirst;;
	-installNode) installNode;;
	-installNpmPackage) installNpmPackage;;
	-installAptPackage) installAptPackage;;
	-installFiles) installFiles;;
	*) showOptions;;
    esac
else
    showOptions
fi
