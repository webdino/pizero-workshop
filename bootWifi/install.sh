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
   -i initialize (set defalut) env.sh (StatusFile="status.txt" , ConfigFile="config.js")

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

# This shell script is called by install.sh, uninstall.sh, bootWifi.sh. 
# And generated and modified by executing install.sh with c,s,i options

Script="bootWifi.sh"
ConfigFile="config.js"
StatusFile="status.txt"

EOF
	    echo "Initialized env.sh, done."
	    . env.sh
	    [ -f $StatusFile ] && rm $StatusFile
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

Setting is array of objects (ssid and passphrase). 
Priority of wifi connection is from head to tail in the array.

複数のwifiアクセスポイントへの接続設定ができます。
上に記述したものから順に優先的に接続されます。
SSIDとパスワードを、ダブルクォーテーションの間（"と"の間）に記述してください。

すべてのダブルクォーテーションの間を記述しなかった場合は、システムのwifi設定は更新されません。
１つでも接続設定が記述されている場合は、システムのwifi設定は一度すべて破棄され、新たな設定が有効になります。
*/

module.exports = [

  //１番優先的に接続させたいアクセスポイント（ないならそのままでよい）
  {ssid: "", passphrase: ""}

  ,
  
  //次に優先的に接続させたいアクセスポイント（ないならそのままでよい）
  {ssid: "", passphrase: ""}

  ,
  
  //３番優先的に接続させたいアクセスポイント（ないならそのままでよい）
  {ssid: "", passphrase: ""}

  ,
  
  //４番優先的に接続させたいアクセスポイント（ないならそのままでよい）
  {ssid: "", passphrase: ""}

  ,
  
  //５番優先的に接続させたいアクセスポイント（ないならそのままでよい）
  {ssid: "", passphrase: ""}

  //以降、よりたくさんのアクセスポイントの接続設定をすることができます。その場合はカンマで区切って同様に記述してください。
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
ExecStart=/bin/bash -c ": > $StatusFile; ./$Script > $StatusFile 2>&1"
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
