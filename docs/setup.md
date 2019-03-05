# セットアップ手順
ワークショップ環境のセットアップ手順です。

* Raspbian をダウンロード: [Download Raspbian for Raspberry Pi](https://www.raspberrypi.org/downloads/raspbian/)
  * Raspi Zero の性能的に full は非推奨だが lite でなくデスクトップでも良い
  * HDMI ディスプレイでのデスクトップ操作は一切しないが、テスクトップ用のイメージを使った場合で以下の説明は続ける
* [balenaEtcher - Home](https://etcher.io/) を使ってダウンロードしたイメージを micro SD カードに焼き込む
  * SD カードは高速なものの方が望ましい。例えば [Sandisk SDSQUAR-016G-GN6MA](https://kakaku.com/item/K0001008471/) は価格、入手性、速度共に文句なし


## USB ケーブルで PC から OTG 接続で操作できるようにする
* 焼き込んだイメージの boot パーティーションを PC の SD カードリーダーでマウント
* OTG で操作したい (USB ホストを無効化する) 場合は config.txt の末尾に以下を追記:
  ```
  # Enable OTG
  dtoverlay=dwc2
  ```
* OTG モードでネットワーククライアントとして起動するには cmdline.txt の `rootwait` の直後に `modules-load=dwc2,g_ether` を挿入
  * 一度も起動してない場合は `quiet init=/usr/lib/raspi-config/init_resize.sh` 等も入ってるが初回起動後には削除される
* boot パーティーション直下に `ssh` という空のファイルを作成 (mac なら `touch /Volumes/boot/ssh` などとする)
* Windows の場合はドライバーと Bonjour のサービスをインストール (Mac では追加インストール作業無し)
  * Windows 10 では不要だがそれ以前で iTunes を入れていない場合は Bonjour Print Service をインストール
    * [ダウンロード - Bonjour Print Services (Windows)](https://support.apple.com/kb/dl999?locale=ja_JP)
  * COM ポートではなくネットワークデバイスとして認識させるドライバーをインストール
    * [DOMOTRONIC Créer vous même vos objets connectés .](http://domotique.caron.ws/wp-content/uploads/telechargement/RPI%20Driver%20OTG.zip)
* `ssh pi@raspberrypi.local` で ssh 接続
  * 初回は接続デバイスの確認がされるので `yes` と入力する
  ```
  The authenticity of host 'raspberrypi.local (fe80::e034:db8c:52d0:ddb0%en13)' can't be established.
  ECDSA key fingerprint is SHA256:136RabIWpBcU5eNiMZbd3A85tTrwvppEFUSItMpE8jc.
  Are you sure you want to continue connecting (yes/no)?
  ```
  * 別の Raspberry Pi 3 に接続するときには登録を消す必要があることに注意。警告が出て繋がらない場合は `ssh-keygen -R raspberrypi.local` コマンドで登録を削除する
* pi ユーザのパスワードを求められるので `raspberry` と入力

参考: [USB OTGを使ったRapsberry Pi Zero WH のセットアップ - Qiita](https://qiita.com/Liesegang/items/dcdc669f80d1bf721c21)


## 一般的な初期設定、ソフトウェアアップデート
* `sudo raspi-config` で設定を変更
  * `3 Boot Options` にてコンソールの pi ユーザへの自動起動に設定。デスクトップ起動に切り替えるときは `startx` すればよい。
  * `4 Localisation Options` でロケール、タイムゾーン、キーボーとレイアウト変更。
    * `en_GB.UTF-8 UTF-8` はオフに、`en_US.UTF-8 UTF-8`, ` ja_JP.EUC-JP EUC-JP`,  `ja_JP.UTF-8 UTF-8` をオンに
    * デフォルトロケールは `ja_JP.UTF-8 UTF-8` に設定
    * タイムゾーンは  Asia -> Tokyo
  * `5 Interfacing Options` にて ssh サーバを有効化
* Mac から RNDIS/Ethernet Gadget へネットワーク共有
  * 接続開始したタイミングで ssh が切れる場合がある。暫く待ったら再度 ssh 可能になる
* 取りあえずアップデートはしておく
  ```
  sudo apt-get update
  sudo apt-get upgrade
  ```
* swap ファイルサイズを `sudo vi /etc/dphys-swapfile` で変更 (nodebrew install などに失敗しないように十分大きく拡張する)
  ```
  # CONF_SWAPSIZE=100
  CONF_SWAPSIZE=1024
  ```
* swap ファイルサイズの変更を反映して確認する:
  ```
  sudo systemctl stop dphys-swapfile
  sudo systemctl start dphys-swapfile
  free -h
  ```


## nodebrew のセットアップ
* node をバージョン管理してインストールする [nodebrew](https://github.com/hokaccha/nodebrew) をインストールして必要バージョンの node を導入する
  ```
  # nodebrew ページ記載の通りセットアップを実行
  curl -L git.io/nodebrew | perl - setup
  # 出力されたとおり、パスに追加するよう `.bashrc` を編集
  echo '# set nodebrew path' >>  ~/.bashrc
  echo 'export PATH=$HOME/.nodebrew/current/bin:$PATH' >>  ~/.bashrc
  # パスの設定を現在のシェルに反映
  source ~/.bashrc
  # 公開されている node バージョンを確認
  nodebrew ls-all
  # v8 系の最新バージョン (執筆時点で 8.15.0) をインストールし、node/npm が使えるようになったことを確認
  nodebrew install v8.15.0
  nodebrew use v8.15.0
  node -v
  npm -v
  ```


## WiFi に自動接続させる

* 接続先 ssid を確認
  ```
  sudo iwlist wlan0 scan | grep ESSID
  ```
* `wpa_passphrase` で `/etc/wpa_supplicant/wpa_supplicant.conf` に WiFi 接続の設定値を追記する
  ```
  # 暗号化済みの設定値を追加
  wpa_passphrase "SSID" "PASS" | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf
  # WiFi オンオフあるいはリブートで自動接続させる
  # sudo ifdown wlan0
  # sudo ifup wlan0
  # sudo reboot
  # 接続状況を確認 (最近は ifconfig より pi addr 推奨)
  ip addr
  ping webdino.org
  # テストが終わったら暗号化されていないパスフレーズを含むコメント行を削除
  sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
  ```
* USB 有線での接続を止めて PC も同じ WiFi に接続し、WiFi から `ssh pi@raspberrypi.local` で ssh 接続できるか確認する
* 接続安定化のためパワーマネージメント機能をオフにするには `/sbin/iw dev wlan0 set power_save off` コマンドを使うが、再起動時に保存されないため `sudo nano /etc/rc.local` で最終行の `exit 0` と書かれている前に実行する行を追記: 
  ```
  # Set WiFi Power Management off
  sudo /sbin/iw dev wlan0 set power_save off
  ```
* 再起動して `iwconfig` で `wlan0` が `Power Management:off` となっていることを確認


## ついでにインストール・設定しておく

* python で bluetooth の操作によく使う bluez をインストール: 
  ```
  sudo apt-get install python-bluez
  ```


## SD カードコピー後、端末固有の設定にする

* hostname をデフォルトの raspberrypi から raspberrypi-NN に変更する
  * 同一 WiFi に複数の Raspi Zero を同時に接続する場合 mDNS (bonjour) で区別可能にするため
* `sudo raspi-config` でホスト名を変更して再起動:
  * 2. Network Options -> Hostname にて変更が可能
  * 変更後に再起動するか聞かれるので再起動させる
* `ssh pi@raspberrypi-NN.local` で接続できることを確認


## 環境センサー 2JCIE-BU を使う

OMRON の環境センサー [2JCIE-BU](https://www.fa.omron.co.jp/products/family/3724/) を使う場合のサンプルです。

* まずはプログラムをコピーしてから ssh でログインして展開し、セットアップする
  ```
  scp Omron2jceBu01.zip pi@raspberrypi-NN.local:~/
  ssh pi@raspberrypi-NN.local
  mkdir src; mv Omron2jceBu01.zip src; cd src
  unzip Omron2jceBu01.zip
  cd Omron2jceBu01
  npm install
  # ADDRESS 変数に自分の使うセンサーのアドレスを : なしで書き込み
  nano test.js
  node test.js
  ```
* センサーのアドレスについて
  * OMRON 2JCIE-BU のアドレスは購入時にセンサーに同封されているシールに記載されています
  * シールがなくなるなどして不明な場合は電源を入れ `sudo hcitool lescan | grep Rbt` コマンドで `FB:29:A9:90:F2:4B Rbt` などと表示されるアドレスを確認
    * この場合 nano test.js では ADDRESS 変数に上記アドレスのコロン無し `FB29A990F24B` を設定

出力例:
```
pi@raspberrypi-NN:~/Omron2jceBu01 $ node test.js
Scan Start!
{"companyId":725,"dataType":1,"sequenceNo":62,"temperature":27.8,"relativeHumidity":20.73,"ambientLight":205,"barometricPressure":1025.296,"soundNoise":42.45,"eTVOC":1,"eCO2":408,"reserveForFutureUse":255}
{"companyId":725,"dataType":1,"sequenceNo":67,"temperature":27.79,"relativeHumidity":20.64,"ambientLight":205,"barometricPressure":1025.3,"soundNoise":46.87,"eTVOC":1,"eCO2":408,"reserveForFutureUse":255}
{"companyId":725,"dataType":1,"sequenceNo":73,"temperature":27.8,"relativeHumidity":20.74,"ambientLight":203,"barometricPressure":1025.301,"soundNoise":53.75,"eTVOC":2,"eCO2":417,"reserveForFutureUse":255}
```


## オムロン公式 SDK で 2JCIE-BU を使う


```
# 依存ライブラリ bluez をインストール
sudo apt-get install python-bluez
# SDK を取得
git clone https://github.com/OmronMicroDevices/envsensor-observer-py.git
cd envsensor-observer-py/envsensor-observer-py
# プログラムに実行権限を付与
chmod a+x envsensor_observer.py
# 設定ファイルを編集
nano conf.py
```

設定ファイル conf.py は次のように読み出し間隔を短く設定する (デフォルト値では 300 秒に一度だからすごく待たされる)

```
#CHECK_SENSOR_STATE_INTERVAL_SECONDS = 300
CHECK_SENSOR_STATE_INTERVAL_SECONDS = 5
```

実行結果:

```
pi@raspberrypi:~/envsensor-observer-py/envsensor-observer-py $ sudo ./envsensor_observer.py
envsensor_observer : complete initialization

----------------------------------------------------
sensor status : 2019-02-18 21:20:32.675702 (Intvl. 5sec)
 FB29A990F24B : Rbt 0x01 : ACTIVE (2019-02-18 21:20:32.633101)

----------------------------------------------------
sensor status : 2019-02-18 21:20:37.707351 (Intvl. 5sec)
 FB29A990F24B : Rbt 0x01 : ACTIVE (2019-02-18 21:20:37.571855)
```
