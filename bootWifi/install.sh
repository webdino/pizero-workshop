#!/bin/bash

set -eu

if ! [ $(whoami) = root ]; then echo 'Root permission required.'; exit 1; fi

ScriptDir=$(cd $(dirname $BASH_SOURCE); pwd)
cd $ScriptDir

if [ $# -gt 0 ] && [ "$1" = '-h' ] ; then
cat <<EOF

- install without any options (default)

- install with following options
   -y (skip confirm (force overwrite if config file is already exists))
   -s filepath (status log file path (default ./status.txt)
   -c filepath (config file path (default ./bootPi.conf)

- initialize
   -i initialize (set defalut) env.sh (Status="status.txt" , ConfigFile="config.js")

EOF
exit 0
fi

ForceOverwite='no'
while getopts "yis:c:" op
do
    case $op in
        y)
            ForceOverwite='yes'
            ;;
	s)
            StatusFile="$OPTARG"
	    sed -i "/^StatusFile=/d" env.sh
	    echo "StatusFile=\"$StatusFile\"" >> env.sh
            ;;
        c)
            ConfigFile="$OPTARG"
	    sed -i '/^ConfigFile=/d' env.sh
	    echo "ConfigFile=\"$ConfigFile\"" >> env.sh
            ;;
	i)
	    cat <<EOF > env.sh
#!/bin/bash

Script="bootWifi.sh"
ConfigFile="config.js"
StatusFile="status.txt"
EOF
	    echo "Initialized env.sh, done."
	    exit 0
	    ;;

        *)
	    exit 1
            ;;
    esac
done

. env.sh

echo 'install bootWifi ...'

ConfigFileWrite(){
    cat <<EOF > $ConfigFile
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
];
*/

module.exports = [

];

EOF
}

if [ -f $ConfigFile ] && [ $ForceOverwite != 'yes' ] ; then
    echo "Setting file:${ConfigFile} is already exist, overwrite? (yes|no)"
    echo -n "> "
    read ForceOverwite
    case $ForceOverwite in
	yes)
	    ConfigFileWrite
	    ;;
	no)
	    :
	    ;;
	*)
	    echo -e "Cannot understand $ForceOverwite.\nInstall fail."
	    exit 1
            ;;
    esac
else ConfigFileWrite; fi

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
ExecStart=/bin/bash -c "./$Script > $StatusFile 2>&1"
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

Please edit setting file:$ConfigFile , and execute following command.

'sudo systemctl enable bootWifi'
'sudo systemctl start bootWifi'

EOF
