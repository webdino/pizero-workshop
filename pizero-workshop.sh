#!/bin/bash

set -eu

script_dir=$(cd $(dirname $BASH_SOURCE); pwd)

. $script_dir/script/env.sh

cd $dir;
NODE_PATH=lib /home/pi/.nodebrew/current/bin/node pizero-workshop.js #2> log/error

