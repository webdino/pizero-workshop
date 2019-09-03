
## 設定応用編
ここからは、さらに便利につかっていくための説明をしていきます。

### 計測間隔を設定する

いまは１分ごとに計測しています。

`config.js`の編集

interval_millisec

### データ送信間隔を設定する

複数回の計測値をまとめて送信することができます。

これにより通信量を減らすことができます

`config.js`の編集

multiple

### Machinistのいろいろな機能をつかってみる



### 別のクラウドサービス（Ambient）にアップロードしてみる

[Ambientでユーザアカウントをつくる]()の手順に沿って進めます。

`config.js`の編集

### Googleドライブにアップロードする

自動で定期的にgoogleドライブにアップロードすることができます。

google driveの設定　　rclone


### microSDカードのCSVファイルに

古いデータは自動でファイル名が



raspberrypi zeroへアクセス
ここからはくわしい人向けになりますが、hostname otg serial_console
