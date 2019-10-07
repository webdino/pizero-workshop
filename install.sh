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
BootDirConfigJs="${BootDir}/config.js"

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
    apt update;
    setupTimezone
    extendSwap
    setupLocale
    sudo raspi-config nonint do_wifi_country JP
    # sudo raspi-config nonint do_expand_rootfs
    echo 'Successfully done.'
}

installNode () {
    #which node > /dev/null || apt install -y nodejs
    #which npm > /dev/null || apt install -y npm
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
    echo -n "make symbolic link /home/pi/.nodebrew/current/bin/node -> /usr/local/bin/node ... "
    ln -sf /home/pi/.nodebrew/current/bin/node /usr/local/bin/node
    echo 'ok'
    echo "make symbolic link /home/pi/.nodebrew/current/bin/npm -> /usr/local/bin/npm ... "
    ln -sf /home/pi/.nodebrew/current/bin/npm /usr/local/bin/npm
    echo 'ok'
    echo 'Successfully done.'
}

installNpmPackages () {
    apt update;
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

installAptPackages () {
    apt update;
    which nkf > /dev/null || apt install -y nkf
    #which node > /dev/null || apt install -y nodejs
    apt install -y libcap2-bin
    # setcap cap_net_raw+eip $(eval readlink -f `which node`)
    setcap cap_net_raw+eip /home/pi/.nodebrew/current/bin/node
    echo 'Successfully done.'
}


ConfigJsInitialContent=$(mktemp)
cat <<EOF > $ConfigJsInitialContent
/*
This is pizero-workshop config.js.

The configuration of single or mulitiple sensing and records are available as array of each setting objects.
Please fill the values of some properties (sensing and records interval time, sensor info, csv file path, machinist acount info, and ambient acount info).

これはpizeroワークショップの設定ファイルです。

１つ以上の環境センサーからデータを集めて、それらをクラウドサービスにアップロードすることが出来ます。（ローカルcsvファイルに保存することも出来ます。）
以下に、それぞれの環境センサーごとに、そのアドレスとcsvファイル保存とクラウドアップロードに関する設定を記述してください。（環境センサー１つの場合はfirst settingの部分だけでよいです）

環境センサーのアドレスを、omron2jcieBu01Addressに記述します。（必須）
データをcsvファイルに出力する場合は、そのファイル名をcsvFilenameに記述します。（任意）
データをMachinistに送信する場合は、machinistApiKeyとmachinistAgentの両方を記述します。（任意）
データをAmbientに送信する場合は、ambientChannelIdとambientWriteKeyの両方を記述します。（任意）
記述は２つのダブルクォーテーション""の間にしてください。

*/

module.exports = [

  //first setting
  {
    intervalMillisec: 60000,    //sensing and record interval (milli second)

    //have to filled belows to sensing
    omron2jcieBu01Name: "Rbt", //maybe fix "Rbt"
    omron2jcieBu01Address: "", //12 charactors of number or aphabet (like "A1B2C3D4E5F6")

    //if filled below, saving csv file 
    csvFilename: "",           //csv file name for saving sensing data. if value is "", not saving.

    //if filled belows, uploading to Machinist
    machinistApiKey: "",       //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistAgent: "",        //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistBatchQuantity: 1, //number of temporary stock the sensing data before sending

    //if filled belows, uploading to Ambient
    ambientChannelId: "",      //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambientWriteKey: "",       //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambientBatchQuantity: 1    //number of temporary stock the sensing data before sending
  }

  ,
  
  //second setting
  {
    intervalMillisec: 60000,    //sensing and record interval (milli second)

    //have to filled belows to sensing
    omron2jcieBu01Name: "Rbt", //maybe fix "Rbt"
    omron2jcieBu01Address: "", //12 charactors of number or aphabet (like "A1B2C3D4E5F6")

    //if filled below, saving csv file 
    csvFilename: "",           //csv file name for saving sensing data. if value is "", not saving.

    //if filled belows, uploading to Machinist
    machinistApiKey: "",       //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistAgent: "",        //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistBatchQuantity: 1, //number of temporary stock the sensing data before sending

    //if filled belows, uploading to Ambient
    ambientChannelId: "",      //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambientWriteKey: "",       //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambientBatchQuantity: 1    //number of temporary stock the sensing data before sending
  }

  ,
  
  //third setting
  {
    intervalMillisec: 60000,    //sensing and record interval (milli second)

    //have to filled belows to sensing
    omron2jcieBu01Name: "Rbt", //maybe fix "Rbt"
    omron2jcieBu01Address: "", //12 charactors of number or aphabet (like "A1B2C3D4E5F6")

    //if filled below, saving csv file 
    csvFilename: "",           //csv file name for saving sensing data. if value is "", not saving.

    //if filled belows, uploading to Machinist
    machinistApiKey: "",       //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistAgent: "",        //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistBatchQuantity: 1, //number of temporary stock the sensing data before sending

    //if filled belows, uploading to Ambient
    ambientChannelId: "",      //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambientWriteKey: "",       //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambientBatchQuantity: 1    //number of temporary stock the sensing data before sending
  }


  //more settings (fourth, fifth, ...) are available in following space with comma and setting objects like above.
  
  
];

EOF

initConfigJs () {
    echo "Initialize '$ConfigJs' ... "
    local Answer=default
    if [ -f $ConfigJs ] ; then
	echo "$ConfigJs is already exists, over write it ? (yes|no)"
	read Answer
	[ $Answer = 'yes' -o $Answer = 'no' ] || exit 1;
    fi
    if [ $Answer = 'default' -o $Answer = 'yes' ]; then
	cat $ConfigJsInitialContent > $ConfigJs
	chown pi:pi $ConfigJs
	echo "'$ConfigJs' initialized, done."
    fi
}

initBootConfigJs () {
    echo "Initialize '$BootDirConfigJs' ... "
    local Answer=default
    if [ -f $BootDirConfigJs ] ; then
	echo "$BootDirConfigJs is already exists, over write it ? (yes|no)"
	read Answer
	[ $Answer = 'yes' -o $Answer = 'no' ] || exit 1;
    fi
    if [ $Answer = 'default' -o $Answer = 'yes' ]; then
	cat $ConfigJsInitialContent > $BootDirConfigJs
	echo "'$BootDirConfigJs' initialized, done."
    fi
}

installFiles () {
    [ -d "$Dir/log" ] || mkdir "$Dir/log"
    [ -d "$BootDir" ] || sudo mkdir "$BootDir"
    [ -d "$BootDir/log" ] || sudo mkdir "$BootDir/log"

    (cd syncLog; ./install.sh -c /boot/setting/syncLogConfig.js -s /boot/setting/syncLogStatus.txt)
    (cd bootPi; ./install.sh -c /boot/setting/bootPi.conf -s /boot/setting/bootPiStatus.txt)
    (cd bootWifi; ./install.sh -c /boot/setting/bootWifiConfig.js -s /boot/setting/bootWifiStatus.txt)
    
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

@reboot	       root bash -c "systemctl start bootPi >> $StarterStatus 2>&1"
@reboot	       root bash -c "systemctl start bootWifi >> $StarterStatus 2>&1"
@reboot	       root bash -c "systemctl start syncLog >> $StarterStatus 2>&1"
@reboot	       root bash -c "cd $Dir; $Starter >> $StarterStatus 2>&1"
#*/1 * * * *    pi bash -c "$Dir/script/traffic.sh >> $Dir/log/traffic.csv"

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
ExecStart=/bin/bash -c "NODE_PATH=lib $Node pizero-workshop.js 2>> $Error"
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
    
    initConfigJs
    initBootConfigJs

    [ -f $StarterStatus ] && rm $StarterStatus
    
    echo 'Successfully done.'
}


showOptions () {
    cat <<EOF

OPTIONS

   -installFirst	
   -installNode
   -installNpmPackages
   -installAptPackages
   -installFiles

   -initConfigJs

EOF
}

if [ $# -gt 0 ]; then
    case "$1" in
	-installFirst) installFirst;;
	-installNode) installNode;;
	-installNpmPackages) installNpmPackages;;
	-installAptPackages) installAptPackages;;
	-installFiles) installFiles;;
	-initConfigJs) initConfigJs;;
	*) showOptions;;
    esac
else
    showOptions
fi
