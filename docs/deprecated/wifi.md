# WiFi 設定手順

Raspberry Pi の WiFi 設定は `/etc/wpa_supplicant/wpa_supplicant.conf` ファイルに書き込むことでネットワークの SSID/PASSPHRASE を保存したり、接続する際の優先順位の設定が可能。

## 個別に設定する

次のようにして `wpa_supplicant.conf` ファイルに ``wpa_passphrase` コマンドの出力を書き足す。`[SSID]`をSSID名, `[PASSPHARSE]`をパスワードに読み替えて実行してください。

```sh
sudo sh -c "wpa_passphrase [SSID] [PASSPHRASE] >> /etc/wpa_supplicant/wpa_supplicant.conf"
# あるいは次のコマンドでも同じ:
wpa_passphrase "[SSID]" "[PASSPHRASE]" | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf
```

実行すると`/etc/wpa_supplicant/wpa_supplicant.conf` に次のように設定が書き足される。

```wpa_supplicant.conf
network={
  ssid="[SSID]"
  #psk="[PASSPHARSE]"
  psk=[暗号化されたPASSPHARSE]
  scan_ssid=1
}
```

`#psk="[PASSPHARSE]"` の部分は暗号化されていないパスフレーズそのまま記載されているため、安全のため隠しておきたい場合はこの行を削除して上書き保存する (技術的には暗号化パスフレーズがあれば接続可能であり、あくまでも非エンジニアがカジュアルに接続するのを抑止したい場合)。

追加した WiFi 設定を有効化するには以下のコマンドで WiFi インターフェイスの再起動を行う

```sh
# WiFi インターフェイスを停止
sudo ifdown wlan0
# WiFi インターフェイスを起動
sudo ifup wlan0
# IP アドレスが取得できているか確認 (wlan0 の inet adder を確認)
ifconfig
```

## 設定済みファイルを各 Raspi Zero にコピーする

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

