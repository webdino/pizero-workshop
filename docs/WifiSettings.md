# Wi-Fiの設定方法

Raspberry PiでWi-Fiを設定するには、以下のコマンドを入力する

```
sudo sh -c "wpa_passphrase [SSID] [PASSPHRASE] >> /etc/wpa_supplicant/wpa_supplicant.conf"
```

`[SSID]`をSSID名, `[PASSPHARSE]`をパスワードに読み替えて実行する

実行すると `/etc/wpa_supplicant/wpa_supplicant.conf` に設定が書き込まれる

`wpa_supplicant.conf`をテキストエディタで開く

```
sudo nano /etc/wpa_supplicant/wpa_supplicant.conf 
```

ファイルの内容は以下のようになる

```wpa_supplicant.conf
network={
  ssid="[SSID]"
  #psk="[PASSPHARSE]"
  psk=[暗号化されたPASSPHARSE]
  scan_ssid=1
}
```

`#psk="[PASSPHARSE]"`の部分が非暗号化パスフレーズなので安全のためこの行を削除して上書き保存する

追加した設定を有効化するには、以下のコマンドを入力する

まず、一度Wi-Fiインターフェイスを停止する

```
sudo ifdown wlan0
```

停止後、Wi-Fiインターフェイスを起動する

```
sudo ifup wlan0
```

以下のコマンドを実行し、`wlan0`の`inet adder`に該当するIPアドレスが表示されているかを確認する。

```
ifconfig
```