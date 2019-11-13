# bootWifi 

bootWifi is a systemd service (bootWifi.service) for Raspbian Buster.
This service task is to resetting a wifi connections (especially when os system starting) with a specific configuration file on Raspbian Buster.

For example, if you make a bootWifi configuration file in `/boot/` (this area is able to read and write by using Windows or MacOS) and edit it, and insart microSD card into Raspberry Pi Zero and power on it, you can reset with new wifi settings without user login to Raspbian Buster. 

## Installation

```
cd bootWifi
sudo ./install
```

#### install command options

- `-c filepath` 
custom install by resetting a configuration file path (auto rewrite `env.sh`)
- `-s filepath`
custom install by resetting a status file path (auto rewrite `env.sh`)
- `-i filepath`
initialize a environment file `env.sh` with system default. 
- `-y`
force overwrite a configuration file with default without any interactions.


Example for install with customized `env.sh`
```
sudo ./install -c "configuration file path"  -s "status file path"
```

Example for initialize the `env.sh`
```
sudo ./install -i
```
## Configuration

For resettng wifi connections by bootWifi, edit `bootWifiConfig.js`. ( if installed with -c "another file path" , edit it. ) This configuration file is javascript source. (required by `bootWifi.js`)
#### Example
bootWifiConfig.js
```javascript
module.exports = [
    {ssid: "ABC", passphrase: "DEF"}
    ,
    {ssid: "ghi", passphrase: "jkl"}
    ,
    {}
    ,
    {}
];
```
As javascript source, exports array of objects (each object has 2 properties `ssid` and `passphrase`).

###### priority
From upper line (head of array) to last line (tail of array), will set the priority values to each wifi connections.

## Usage
- start service
```
sudo systemctl start bootWifi.service
```
 - enable service

```
sudo systemctl enable bootWifi.service
```

## How to work

```
bootWifi.service --ExecStart--> bootWifi.sh

bootWifi.sh --call--> check.js
            --call--> generateWpa



```
Finally, bootWifi.service is in service-activity(dead) successfully.
