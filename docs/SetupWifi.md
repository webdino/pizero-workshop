# WiFi 設定について

Raspberry Pi の WiFi 設定は `/etc/wpa_supplicant/wpa_supplicant.conf` ファイルに書き込むことでネットワークの SSID/PASS を保存したり、接続する際の優先順位の設定が可能。

## 個別に設定する場合
`wpa_passphrase` コマンドの出力を書き足す。書き足しに root 権限が必要なのでパイプで渡して `sudo tee` で受け取っていることに注意。

```sh
wpa_passphrase "SSID" "PASS" | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf
```

## 複数の Raspi Zero に書き込んでいく場合
最初に設定した Raspi Zero の `wpa_supplicant.conf` をローカル PC にコピーしておき、それを各端末に順次書き込んでいく。各 Raspberry Pi Zero のホスト名を変更している場合は ssh 接続先のホスト名を読み替えてください。

まずは変更前の WiFi から書き込む。書き換えに root 権限が必要なので標準入力を `sudo dd` で受け取っていることに注意

```sh
ssh pi@raspberrypi.local "sudo dd of=/etc/wpa_supplicant/wpa_supplicant.conf" < wpa_supplicant.conf
ssh pi@raspberrypi.local "sudo reboot"
```

PC を新しい設定で接続される WiFi に接続し直して接続テストし問題なければシャットダウンさせる:

```sh
ssh pi@raspberrypi.local echo OK
ssh pi@raspberrypi.local "sudo shutdown now"
```

同様に他の端末にも書き込んでいく。


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
	ssid="otherssid"
	psk=891d589c5885303ba9bfe8734b287d06d2f7886cda467ee1130bf42278943887
	priority=5
}
```

