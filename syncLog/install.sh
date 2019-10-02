#!/bin/bash

set -eu

if ! [ $(whoami) = root ]; then echo 'Error: root permission required.'; exit 1; fi

ScriptDir=$(cd $(dirname $BASH_SOURCE); pwd)
cd $ScriptDir

if [ $# -gt 0 ] && [ "$1" = '-h' ] ; then
cat <<EOF

- install without any options (default)

- install with following options
   -y (skip confirm (force overwrite if config file is already exists))
   -s filepath (status log file path (default ./status.txt)
   -c filepath (config file path (default ./config.js)

- initialize
   -i initialize (set defalut) env.sh (ConfigFile="config.js", StatusFile="status.txt")

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

Start="start.sh"
CheckConfig="checkConfig.js"
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

echo 'install syncLog ...'

ConfFileWrite(){
    cat <<EOF > $ConfigFile
/*
This is syncLog setting file (Javascript source).
Setting is array of objects. 
Followings are example of setting.

module.exports = [
  {
    type: 'rsync',                           //rsync
    intervalHours: 1,                        //execute interval hours
    source: '/home/pi/source_dir/',          //local directory
    dest: '/boot/data/'                      //local directory
  }
  ,
  {
    type: 'rclone',                          //rclone
    intervalHours: 24,                       //execute interval hours
    rcloneConf: '/boot/rclone.conf',         //file generated by rclone
    source: '/boot/data',                    //source directory
    destService: 'gdrive',                   //service name in rclone.conf
    destDir: 'data'                          //folder in cloud service
  }
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
	    ConfFileWrite
	    ;;
	no)
	    :
	    ;;
	*)
	    echo -e "Cannot understand '$ForceOverwite'.\nInstall fail."
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
ExecStart=/bin/bash -c "./$Start > $StatusFile 2>&1"
#ExecStop=/bin/bash -c "./$Start -execStop > $StatusFile 2>&1"
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

Please edit setting file:$ConfigFile , and execute following command.

'sudo systemctl enable syncLog'
'sudo systemctl start syncLog'

EOF


