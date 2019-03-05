# WiFi 設定について

Raspberry Pi の WiFi 設定は `/etc/wpa_supplicant/wpa_supplicant.conf` ファイルに書き込むことでネットワークの SSID/PASS を保存したり、接続する際の優先順位の設定が可能。

## 個別に設定する場合
`wpa_passphrase` コマンドの出力を書き足す:

```sh
wpa_passphrase "SSID" "PASS" | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf
```

## 複数の Raspi Zero に書き込んでいく場合
まずは変更前の WiFi から

```sh
ssh pi@raspberrypi.local "sudo dd of=/etc/wpa_supplicant/wpa_supplicant.conf" < wpa_supplicant.conf
ssh pi@raspberrypi.local "sudo reboot"
```

PC を新しい設定で接続される WiFi に接続し直して接続テスト:

```sh
ssh pi@raspberrypi-NN.local echo OK
ssh pi@raspberrypi-NN.local "sudo shutdown now"
```

## サンプル

こんな感じのファイル

```
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
# priority は数値が高い方から順に接続する
network={
	ssid="somessid"
	psk=5700c6dac3e9d842e199a4a69042689f343ef377f5bc6bc40aa6171676942894
	priority=0
}
network={
	ssid="somewifi"
	psk=891d589c5885303ba9bfe8734b287d06d2f7886cda467ee1130bf42278943887
	priority=5
}
```

