# bootPi

bootPi is a systemd service (bootPi.service) for Raspbian Buster.
This service task is to resetting hostname, ssh, otg, serial console, wlan0 ipaddress etc, (especially when os system starting) with a specific configuration file on Raspbian Buster.

For example, if you make a bootPi configuration file in `/boot/` (this area is able to read and write by using Windows or MacOS) and edit it, and insart microSD card into Raspberry Pi Zero and power on it, you can start with new hostname, ssh, serial console, wlan0 ipaddres etc, without user login to Raspbian Buster. 

## Installation

```
cd bootPi
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
force overwrite a configuration file to default without any interactions.


Example for install with customized `env.sh`
```
sudo ./install -c "configuration file path"  -s "status file path"
```

Example for initialize the `env.sh`
```
sudo ./install -i
```
## Configuration

For resettng hostname, ssh, otg, serical console, wlan0 ipaddress etc, by bootPi, edit `bootPi.conf`. ( if installed with -c "another file path" , edit it. ) 

#### Example
bootPi.conf
```
# This is bootPi setting file.
#
# Comment line is available only with line head # charactor.
#
# Setting is a collection of directive and value with semicolon separation.
#
# ssh, otg, serial_console (these are enable or disable.)
# ssh (enable|disable)
# otg (enable|disable)
# serial_console (enable|disable)
#
# static_ip_address, static_rooters, static_domain_name_servers (these are will be into /etc/dhcpcd.conf .)
# static_ip_address (ip address)
# static_rooters (ip address)
# static_domain_name_servers (ip address)
#
# hostname (first and last charactors are only 0-9 or a-z, others are 0-9 or a-z or -(hiphen).)
#
# Followings are example of setting.

#ssh: enable
#ssh: disable
#otg: enable
#otg: disable
#serial_console: enable
#serial_console: disable
#static_ip_address: 192.168.0.2/24
#static_rooters: 192.168.0.1
#static_domain_name_servers: 192.168.0.1
#hostname: raspberrypi
```

It's better to use `ssh:`, `otg:`, `serial_console:`, `hostname:` only when you want to change each settings, by removing line head sharp character.

And use `static_ip_address:`, `static_rooters:`, `static_domain_name_servers:` anytime when you want to reflect each settings to `wlan0` interface on network system.

## Usage
- start service
```
sudo systemctl start bootPi.service
```
 - enable service

```
sudo systemctl enable bootPi.service
```

Attension, both above commands might be execute reboot os system imidiately ! , because bootPi modify os system settings and execute reboot for reflecting its new os system settings.

But, bootPi started and compared a current system settings and a configuration file, and if it judged their are same, it will do nothing. (not execute reboot)

## How to work

```
bootPi.service --ExecStart--> bootPi.sh

bootPi.sh --execute--> env.sh

```
Finally, bootPi.service is in service-activity(dead) successfully.
