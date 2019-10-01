#!/bin/bash

set -eu

echo 'install syncLog ...'

if ! [ $(whoami) = root ]; then echo 'Error: root permission required.'; exit 1; fi

ScriptDir=$(cd $(dirname $BASH_SOURCE); pwd)
cd $ScriptDir
. env.sh

ConfFileWrite(){
    cat <<EOF > $ConfigJs
/*
This is syncLog setting file (Javascript source).
 
Setting is array of objects. 

Followings are example of setting.

module.exports = [
  {
    type: 'rsync',
    intervalHours: 1,
    source: '/home/pi/pizero-workshop/log/',
    dest: '/boot/setting/log/'
  }
  ,
  {
    type: 'rclone',
    intervalHours: 24,
    rcloneConf: '/boot/setting/rclone.conf',
    source: '/boot/setting/log',
    destService: 'gdrive',
    destDir: 'pizero-workshop'
  }
]
*/

module.exports = [
  {
    type: 'rsync',
    intervalHours: 1,
    source: '/home/pi/pizero-workshop/log/',
    dest: '/boot/setting/log/'
  }
  ,
  {
    type: 'rclone',
    intervalHours: 24,
    rcloneConf: '/boot/setting/rclone.conf',
    source: '/boot/setting/log',
    destService: 'gdrive',
    destDir: 'pizero-workshop'
  }
]

EOF
}
	   
if [ -f $ConfigJs ]; then
    echo "Setting file:${ConfigJs} is already exist, overwrite? (yes|no)"
    echo -n "> "
    read Answer
    case $Answer in
	yes)
	    ConfFileWrite
	    ;;
	no)
	    :
	    ;;
	*)
	    echo -e "Cannot understand $Answer.\nInstall fail."
	    exit 1
            ;;
    esac
else ConfFileWrite; fi

which nkf > /dev/null || apt install -y nkf
which node > /dev/null || apt install -y nodejs
which rclone > /dev/null || apt install -y rclone

# systemd
cat <<EOF > /etc/systemd/system/syncLog.service
[Unit]
Description=syncLog
After=syslog.target network.target

[Service]
Type=simple
WorkingDirectory=$ScriptDir
ExecStart=/bin/bash -c "./$Start > $Status 2>&1"
ExecStop=/bin/bash -c "./$Start -execStop > $Status 2>&1"
User=root
Group=root
StandardOutput=journal
StandardError=journal

[Install]
WantedBy = multi-user.target

EOF

#systemctl disable syncLog
systemctl daemon-reload
#systemctl enable syncLog

cat <<EOF

Installed successfully.

Please edit setting file:$ConfigJs , and execute following command.

'sudo systemctl enable syncLog'
'sudo systemctl start syncLog'

EOF


