#!/bin/bash

set -eu

echo 'install bootWifi ...'

if ! [ $(whoami) = root ]; then echo 'Root permission required.'; exit 1; fi

ScriptDir=$(cd $(dirname $BASH_SOURCE); pwd)
. env.sh

ConfFileWrite(){
    cat <<EOF > $ConfigJs
/*
This is bootWifi setting file (Javascript source).
 
Setting is array of objects(ssid and passphrase). 

Priority of wifi connection is from head to tail in the array.

Followings are example of setting.

(複数のwifiを接続候補にすることができます。
以下のサンプルでは、まずssid1に優先的に接続が試みられ、ついでssid2、最後にss"id3になります。)

module.exports = [
  {ssid: "ssid1", passphrase: "pass111111111"}
  ,
  {ssid: "ssid2", passphrase: "!@#$%^&*()_+-="}
  ,
  {ssid: "ss\"id3", passphrase: "abcdef\"pqrstuv"}
]
*/

module.exports = [

];

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

# systemd
cat <<EOF > /etc/systemd/system/bootWifi.service
[Unit]
Description=bootWifi
After=syslog.target network.target

[Service]
Type=simple
WorkingDirectory=$ScriptDir
ExecStart=/bin/bash -c "./$Script > $Status 2>&1"
User=root
Group=root
StandardOutput=journal
StandardError=journal

[Install]
WantedBy = multi-user.target

EOF

#systemctl disable bootWifi
systemctl daemon-reload

cat <<EOF

Installed successfully.

Please edit setting file:$ConfigJs , and execute following command.

'sudo systemctl enable bootWifi'
'sudo systemctl start bootWifi'

EOF
