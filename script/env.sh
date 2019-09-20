#!/bin/bash

set -eu

package_name="pizero-workshop"
dir="/home/pi/${package_name}"
boot_dir="/boot/setting"
HostnameConf="${boot_dir}/hostname.conf"
SshFile="${boot_dir}/ssh"
OtgFile="${boot_dir}/otg"
SerialConsoleFile="${boot_dir}/serialconsole"
Error="${boot_dir}/status"
RcloneConf="${boot_dir}/rclone.conf"
Rclone="${boot_dir}/rclone.sh"
Rsync="${boot_dir}/rsync.sh"
Cron="${boot_dir}/cron"
Logrotate="${boot_dir}/logrotate"
StartCommand="$dir/pizero-workshop.sh"
Node='/home/pi/.nodebrew/current/bin/node'
