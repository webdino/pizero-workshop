#!/bin/bash

set -eu

script_dir=$(cd $(dirname $BASH_SOURCE); pwd)
. $script_dir/env.sh

setup_timezone () {
    echo -n 'Setup timezone... '
    timedatectl set-timezone Asia/Tokyo
    timedatectl | grep 'Time zone:' | xargs
}

extend_swap () {
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

setup_locale (){
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

install_first () {
    [ -d "$boot_dir" ] || sudo mkdir "$boot_dir" 
    setup_timezone
    extend_swap
    setup_locale
    sudo raspi-config nonint do_wifi_country JP
    # sudo raspi-config nonint do_expand_rootfs
}

install_node () {
    su - pi <<EOF
    export PATH=\$HOME/.nodebrew/current/bin:\$PATH
    if [ \$(which node) ] && [ \$(node -v) = 'v8.15.0' ]; then
	echo 'Already exist node v8.15.0, Ok.'
	exit 0;
    else
	echo -n 'Install node... '
	if ! [ "$(which nodebrew)" ]; then curl -L git.io/nodebrew | perl - setup; fi
	    export PATH=\$HOME/.nodebrew/current/bin:\$PATH
 	    echo '# set nodebrew path' >> \$HOME/.bashrc
 	    echo 'export PATH=\$HOME/.nodebrew/current/bin:\$PATH' >> \$HOME/.bashrc
	    # shopt -s expand_aliases
	    . \$HOME/.bashrc
	if ! [ "$(which node)" = \$HOME/.nodebrew/current/bin/node ]; then
	    nodebrew ls-all
	    nodebrew install v8.15.0
	    nodebrew use v8.15.0
	    echo -n 'node version: '; node -v
	    echo -n 'npm version: '; npm -v
	fi
    fi
EOF
}

install_npm_package () {
    apt install -y bluetooth bluez libbluetooth-dev libudev-dev
    su - pi <<EOF
    export PATH=/home/pi/.nodebrew/current/bin:\$PATH
    echo -n "Install npm package... "
    cd "\$dir"
    npm i
    if [ \$? ]; then echo "Done."; else "Warning: npm package install is not successfully finished."; fi
EOF
}

install_apt_package () {
    apt install -y rclone
    apt install -y libcap2-bin
    # setcap cap_net_raw+eip $(eval readlink -f `which node`)
    setcap cap_net_raw+eip /home/pi/.nodebrew/current/bin/node
}


install_files () {
    touch $boor_dir/ssh
    
    [ -d $dir/log ] || mkdir $dir/log
    # logrotate TODO filename.csv #$dir/log/Omron2jcieBu01.csv {
    cat <<EOF > $Logrotate
$dir/log/name.csv {
	weekly
	dateext
	dateformat %Y%m%d
	postrotate
	  mv $dir/log/name.csv-`date '+%Y%m%d'` $dir/log/name.`date '+%Y%m%d'`.csv
	rotate 100
	missingok
	nocompress
	ifempty
	create 0640 pi pi
}

EOF
    ln -fs /etc/logrotate.d/pizero-workshop $Logrotate

    # cron
    cat <<EOF > $Cron
SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

@reboot	       root bash -c "$dir/script/start.sh > $Error"
00 0 * * *     root bash -c "($boot_dir/rsync.sh $boot_dir/rclone.sh) 2>> $Error"
#*/1 * * * *    pi bash -c "$dir/traffic.sh >> $dir/log/traffic.csv"

EOF
    ln -fs /etc/cron.d/pizero-workshop $Cron

    # rclone
    cat <<EOF > $Rclone
#!/bin/bash
rclone --config $RcloneConf copy $boot_dir/log [google drive]:pizero-workshop
EOF

    # rsync
    cat <<EOF > $Rsync
#!/bin/bash
rsync -a $dir/log/ $boot_dir/log/
EOF
    
    # systemd 
    cat <<EOF > /etc/systemd/system/pizero-workshop.service
[Unit]
Description=pizero-workshop
After=syslog.target network.target

[Service]
Type=simple
WorkingDirectory=$dir
ExecStart=/bin/bash -c "$StartCommand > $Error 2>&1"
TimeoutStopSec=5
KillMode=process
Restart=always
User=root
Group=root
StandardOutput=journal
StandardError=journal

[Install]
WantedBy = multi-user.target

EOF

    [ -d /home/pi/Desktop ] && ln -nfs /boot/setting /home/pi/Desktop/setting
    systemctl daemon-reload
    systemctl disable pizero-workshop #systemctl enable pizero-workshop
    echo 'Successfully done.'
}


show_options () {
    cat <<EOF

OPTIONS
   -install_first	
   -install_node
   -install_npm_package
   -install_apt_package
   -install_files

EOF
}

if [ $# -gt 0 ]; then
    if ! [ $(whoami) = root ]; then echo 'Error: root permission required.'; exit 1; fi
    case "$1" in
	-install_first) install_first;;
	-install_node) install_node;;
	-install_npm_package) install_npm_package;;
	-install_apt_package) install_apt_package;;
	-install_files) install_files;;
	*) show_options;;
    esac
else
    show_options
fi


