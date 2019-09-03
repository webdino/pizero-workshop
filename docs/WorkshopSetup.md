
# bird

## setup from raspbian buster
```
cd bird;
./setup.sh -setup_step1
./setup2.sh -install_node
./setup2.sh -install_npm
./setup2.sh -install_etc
./setup2.sh -install_etc2
```

## test
edit the `config.js` (sensor address, and cloud api key, etc)

```
sudo ./pizero-workshop.sh
```

## Create a directory and files in Sd card boot area for auto starting the service
```
/boot/setting/hostname.txt
/boot/setting/wifi.txt
/boot/setting/config.js
```

### /boot/setting/wifi.txt
separate by comma, upper line has higher priority
```
ssid,passphrase
ssid,passphrase
ssid,passphrase
```
### /boot/setting/config.js
```
module.exports = {
    "NAME": "Rbt",
    "ADDRESS": "",
    "INTERVAL_MILLISEC": 60000,
    "RECORDS": ["CSV", "MACHINIST"],
    //"RECORDS": ["CSV", "AMBIENT"]
    //"RECORDS": ["CSV", "MACHINIST", "AMBIENT],
    "MACHINIST_API_KEY": "",
    "MACHINIST_MULTIPLE": 
    //"AMBIENT_CHANNEL": ,
    //"AMBIENT_WRITE_KEY": ""
    //"AMBIENT_MULTIPLE": 
};
```