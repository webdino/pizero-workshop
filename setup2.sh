#!/bin/bash

set -eu

script_dir=$(cd $(dirname $BASH_SOURCE); pwd)

. $script_dir/env.sh

[ -d $boot_dir ] || mkdir $boot_dir

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

install_etc () {
    apt install -y rclone
    apt install -y libcap2-bin
    # setcap cap_net_raw+eip $(eval readlink -f `which node`)
    setcap cap_net_raw+eip /home/pi/.nodebrew/current/bin/node
}

install_etc2 () {
    mkdir $dir/log
    
cat <<EOF > /etc/logrotate.d/pizero-workshop
$dir/log/Omron2jcieBu01.csv {
	weekly
	dateext
	rotate 20
	missingok
	nocompress
	ifempty
	create 0640 pi pi
}

EOF

cat <<EOF > /etc/cron.d/pizero-workshop
SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

@reboot	       root $dir/setup.sh -wifi_txt
@reboot	       root /sbin/iw dev wlan0 set power_save off
@reboot	       root $dir/pizero-workshop-starter.sh
#*/1 * * * *    pi bash -c "$dir/traffic.sh >> $dir/log/traffic.csv"

00 0 * * *  root $dir/rclone.sh
00 0 * * *  root rsync -a $dir/log/ /boot/setting/log/
@reboot     root rsync -a $dir/log/ /boot/setting/log/

EOF

cat <<EOF > /etc/systemd/system/pizero-workshop.service
[Unit]
Description=pizero-workshop
After=syslog.target network.target

[Service]
Type=simple
WorkingDirectory=$dir
ExecStart=$dir/pizero-workshop.sh
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
#systemctl enable pizero-workshop
systemctl disable pizero-workshop 

echo 'Successfully done.'
}

show_options () {
    cat <<EOF

OPTIONS

   -install_node
   -install_npm_package
   -install_etc
   -install_etc2

EOF
}

if [ $# -gt 0 ]; then
    if ! [ $(whoami) = root ]; then echo 'Error: root permission required.'; exit 1; fi
    case "$1" in
	-install_node) install_node;;
	-install_npm_package) install_npm_package;;
	-install_etc) install_etc;;
	-install_etc2) install_etc2;;
	*) show_options;;
    esac
else
    show_options
fi


