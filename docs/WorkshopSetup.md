# pizero-workshop

Only edit the microSD car boot area, sensing and uploading and saving.

## Installl in raspbian buster

For showing command options, execute following.
```
cd pizero-workshop;
sudo ./install
```

Step by step to install.
```
sudo ./install -installFirst
sudo ./install -installNode
sudo ./install -installNpmPackages
sudo ./install -installAptPackages
sudo ./install -installFiles
```

## Main service

Main service do sensing, and uploading to the cloud, and saving the csv to local.

### Configuration and test

Edit the `setting/config.js` (sensor address, and cloud api key, csv filename, etc)

After configuration, execute following command.
```
cd pizero-workshop
sudo npm start
```

And testing start service (systemd).
```
sudo systemctl start pizero-workshop
```

## Sub services

There are 3 sub services (systemd) for supporting pizero-workshop.

### bootPi

Service (systemd) for editing microSD card boot area to changing hostname, ssh(on/off) , otg(on/off), serial console(on/off), fixing wifi local ip address when system start up.

configuration
```
/boot/setting/bootPi.conf
```

### bootWifi

Service (systemd) for editing microSD card boot area to setup wifi connection when system start up.

configuration
```
/boot/setting/bootWifiConfig.js
```

### syncLog

Service (systemd) for editing microSD card boot area to execute rsync and rclone regularly.

configuration
```
/boot/setting/syncLogConfig.js
```
