#!/bin/bash

set -eu

if ! [ $(whoami) = root ]; then echo 'Error: root permission required.'; exit 1; fi

config=/boot/setting/rclone.txt
from=/home/pi/bird/log
to=/pizero-workshop

cat $config | sed -n 's#^\s*\[\(.*\)\]\s*$#\1#p' | while read _line; do
    echo "copy to $_line"
    rclone --config "$config" copy $from "$_line":$to
done

echo 'Successfully done.'
