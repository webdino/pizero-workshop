#!/bin/bash

set -eu

script_dir=$(cd $(dirname $BASH_SOURCE); pwd)

. $script_dir/env.sh

setup_otg () {
    echo -n 'Setup otg... '
    config_file='/boot/config.txt'
    if sudo grep -q 'dtoverlay=dwc2' $config_file; then
	echo 'Already otg is enable.' && return
    else
	echo 'dtoverlay=dwc2' | sudo tee -a $config_file
	sudo sed -i 's/rootwait /rootwait modules-load=dwc2,g_ether /g' '/boot/cmdline.txt'
	echo 'done.'
    fi
}				

enable_ssh_server () {

    ssh_check () {
	if [ $(systemctl list-unit-files --type service | grep ssh.service | awk '{print $2}') = 'enabled' ]; then return 0; else return 1; fi;
    }

    echo -n 'Setup ssh... '
    ssh_check && echo 'Already ssh.service is enabled.' ||
	    (sudo systemctl enable ssh; (ssh_check && echo 'ssh.service is enabled' || echo "warning: ssh.service can't be enabled."; return 1))
}

setup_timezone () {
    echo -n 'Setup timezone... '
    sudo timedatectl set-timezone Asia/Tokyo
    timedatectl | grep 'Time zone:' | xargs
}

extend_swap () {
    local swap_file='/etc/dphys-swapfile'
    if sudo grep -q '^CONF_SWAPSIZE=' $swap_file; then
	sudo sed -i 's/^CONF_SWAPSIZE=.*/CONF_SWAPSIZE=1024/g' $swap_file
    else
	sudo echo 'CONF_SWAPSIZE=1024' >> $swap_file
    fi
    sudo systemctl stop dphys-swapfile
    echo -n 'Resize swap area to 1.0G now... '
    sudo systemctl start dphys-swapfile
    [ '1.0Gi' = $(free -h | grep 'Swap:' | awk '{print $2}') ] && echo 'done.' || echo "warning: Swap area size is not 1.0G"
}

setup_locale (){
    echo -n "Setup locale... "
    if locale | grep "LANG=ja_JP\.UTF-8"; then
	echo "Already locale 'LANG=ja_JP.UTF-8' exists, Ok."
	return 0
    else
	local file='/etc/locale.gen'
	grep ^[^#] $file | while read _LINE; do sudo sed -i "s/${_LINE}/\# ${_LINE}/" $file; done
	sudo sed -i 's/^# ja_JP.UTF-8/ja_JP.UTF-8/g' $file
	sudo sed -i 's/^# ja_JP.EUC-JP/ja_JP.EUC-JP/g' $file
	sudo sed -i 's/^# en_US.UTF-8/en_US.UTF-8/g' $file
	sudo locale-gen
	sudo update-locale LANG=ja_JP.UTF-8
	echo "Setup locale is done."
	echo 'Please reboot before next setup (Recommend).'
    fi
}

setup_hostname () {
    local _current=$(hostname)
    [ -s $host_txt ] || { echo "File '${host_txt}' is not exist."; return 0; }
    local _new=$(awk 'NR==1 {print $1}' $host_txt)
    [ $_new ] || { echo "New hostname in '${host_txt}' is not invalid."; return 0; }
    [ $_current = $_new ] && { echo "New hostname in '${host_txt}' is equal to old hostname."; return 0; }
    echo 'Reset to new hostname now ...'
    sudo raspi-config nonint do_hostname $_new
    sudo reboot
}				

wifi_txt () {

    setup_wifi_sub () {
	local priority=0
	tac $1 | while read _LINE; do
	    if echo $_LINE | grep -q '^\s*$'; then continue; fi #skip empty line
	    #eval $(echo $_LINE | awk -F ',' '{print "wpa_passphrase " $1 " " $2}') | sed "s/\#psk=.*$/priority=${priority}/"
	    eval $(echo $_LINE | awk -F ',' '{print "wpa_passphrase \"" $1 "\" \"" $2 "\""}') | sed "s/\#psk=.*$/priority=${priority}/"
	    priority=$(( $priority + 1 ))
	done
    }

    check_wifi_txt () {
	if ! [ -s $1 ]; then echo "$wifi_txt is empty or nothing, and not modified $conf_file."; return 1; fi
	# format check
	while read _LINE; do
	    if echo $_LINE | grep -q '^\s*$'; then continue; fi #skip empty line
	    echo $_LINE | awk -F ',' '{print "wpa_passphrase \"" $1 "\" \"" $2 "\""}'
	    if eval $(echo $_LINE | awk -F ',' ); then
		:
	    else
		echo "'$1' has invalid form."
		return 1
	    fi
	done < $1
	echo "'$1' format is ok."
	return 0
    }

    conf_file='/etc/wpa_supplicant/wpa_supplicant.conf'
    if check_wifi_txt $wifi_txt; then
	result=$(setup_wifi_sub $wifi_txt)
	header='ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev\nupdate_config=1\ncountry=JP'
	echo -e "${header}\n\n${result}" | sudo tee $conf_file

	sudo killall wpa_supplicant
	sudo su -c 'wpa_supplicant -B -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf'
	
	sudo rm $wifi_txt; sudo touch $wifi_txt; echo "Successfully done, and $wifi_txt is already empty."
    fi
}

setup_step1 () {
    sudo raspi-config nonint do_wifi_country JP
    [ -d "$boot_dir" ] || sudo mkdir "$boot_dir" && sudo touch "$wifi_txt"
    # serial console
    # dhcpcd
    setup_otg
    enable_ssh_server
    setup_timezone
    extend_swap
    setup_locale
}

show_options () {
    cat <<EOF

OPTIONS

  Please execute with -setup_step1(and reboot)

   -setup_step1

  Following options are for manual setup 

   -set_start_service (Add wifi setup script (this will read 'wifi.txt' when boot), sensing and upload (forever daemon) to '/etc/rc.local'.)
   -setup_hostname (If hostname is changed, reboot.)
   -extend_swap
   -setup_otg
   -setup_locale
   -setup_timezone
   -enable_ssh_server

EOF
}

if [ $# -gt 0 ]; then
    if ! [ $(whoami) = root ]; then echo 'Error: root permission required.'; exit 1; fi
    case "$1" in
	-wifi_txt) wifi_txt;;
	-setup_hostname) setup_hostname;;
	-extend_swap) extend_swap;;
	-setup_otg) setup_otg;;
	-setup_locale) setup_locale;;
	-setup_timezone) setup_timezone;;
	-enable_ssh_server) enable_ssh_server;;

	-setup_step1) setup_step1;;

	-no) ;;
	
	*) show_options;;
    esac
else
    show_options
fi

# sudo raspi-config nonint do_expand_rootfs
# sudo raspi-config nonint do_wifi_country JP
# wifi_scan_check () {
#     if [ $(sudo iwlist wlan0 scan | grep $ssid) ]; then
# 	echo "wifi ${ssid} is found."
#     else
# 	echo "warning: wifi ${ssid} is not found."
# 	#exit 1
#     fi
# }

