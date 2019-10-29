_この文書の内容はメンテナンスされておらず古い内容のため、実際の環境での方法と大きく異なる可能性があります。_

# プログラムをサービス化する

プログラムをサービス化することで、Raspberry Piを起動したときに自動的にプログラムを開始してセンシングを実行することができます

## サービスを設定する

SSHクライアントでRPiに接続し、プログラムファイルがあるディレクトリに移動します

```
cd ~/src/Omron2jceBu01
```

以下のコマンドを実行してサービス設定ファイルを`/etc/systemd/system/`にコピーします

```
sudo cp omron2jciebu01.service /etc/systemd/system/
```

サービス設定ファイルに実行権限を付与します

```
sudo chmod +x /etc/systemd/system/omron2jciebu01.service
```

サービスを開始します

```
sudo systemctl start omron2jciebu01
```

ステータスを確認します

```
systemctl status omron2jciebu01 -l
```

`Active: active (running)` となっていれば成功です

```
● omron2jciebu01.service - Omron2JCIEBU01
   Loaded: loaded (/etc/systemd/system/omron2jciebu01.service; disabled; vendor
   Active: active (running) since Thu 2019-02-21 08:40:34 GMT; 38s ago
 Main PID: 2545 (node)
   CGroup: /system.slice/omron2jciebu01.service
           └─2545 /home/pi/.nodebrew/current/bin/node /home/pi/src/Omron2jceBu01

Feb 21 08:40:34 raspberrypi systemd[1]: Started Omron2JCIEBU01.
Feb 21 08:40:40 raspberrypi node[2545]: Scan Start!
```

`q` を入力して表示をクローズします

いったんサービスを終了します

```
sudo systemctl stop omron2jciebu01
```

ステータスを確認します

```
systemctl status omron2jciebu01 -l
```

`Active: inactive (dead)`となっていれば終了しています

```
● omron2jciebu01.service - Omron2JCIEBU01
   Loaded: loaded (/etc/systemd/system/omron2jciebu01.service; disabled; vendor
   Active: inactive (dead)

Feb 21 08:40:34 raspberrypi systemd[1]: Started Omron2JCIEBU01.
Feb 21 08:40:40 raspberrypi node[2545]: Scan Start!
Feb 21 08:42:59 raspberrypi systemd[1]: Stopping Omron2JCIEBU01...
Feb 21 08:42:59 raspberrypi systemd[1]: Stopped Omron2JCIEBU01.
```

`q` を入力して表示をクローズします

## Raspberry Pi起動時にサービスを自動起動する

以下のコマンドでサービスを登録します

```
sudo systemctl enable omron2jciebu01
```

PRiを再起動します

```
sudo reboot
```

再起動完了後、SSHでRPiにログインし、サービスのステータスを確認します

```
systemctl status omron2jciebu01 -l

● omron2jciebu01.service - Omron2JCIEBU01
   Loaded: loaded (/etc/systemd/system/omron2jciebu01.service; enabled; vendor p
   Active: active (running) since Thu 2019-02-21 08:47:24 GMT; 5min ago
 Main PID: 313 (node)
   CGroup: /system.slice/omron2jciebu01.service
           └─313 /home/pi/.nodebrew/current/bin/node /home/pi/src/Omron2jceBu01/

Feb 21 08:47:24 raspberrypi systemd[1]: Started Omron2JCIEBU01.
Feb 21 08:47:42 raspberrypi node[313]: Scan Start!
```

`Active: active (running)` になっていれば成功です。以降RPiに電源を入れるとセンシングサービスが自動起動するようになります

## サービスを停止する場合

自動起動を停止し、サービスを起動しないようにするためには以下を実行します

```
sudo systemctl disable omron2jciebu01

sudo systemctl stop omron2jciebu01
```

## プログラムを変更してサービスを再起動する場合

プログラムに変更を加えた場合、サービスを再起動しないと新しいプログラムの機能が反映されません。サービスを再起動するには以下のようにします

```
sudo systemctl daemon-reload

sudo systemctl restart omron2jciebu01
```
