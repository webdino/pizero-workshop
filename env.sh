#!/bin/bash

set -eu

package_name="pizero-workshop"

dir="/home/pi/${package_name}"
boot_dir="/boot/setting"
wifi_txt="${boot_dir}/wifi.txt"
host_txt="${boot_dir}/hostname.txt"

