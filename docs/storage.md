## SD カードや Google Drive にデータを記録する

### microSDカードに計測データを保存してみる

計測されたデータはクラウドに自動で送信されるように設定されていますが、実はmicroSDカードにも自動で保存されています。

`config.js`の`csvFilename:` の部分です。

予想がつくかと思いますが、この`csvFilename:`の部分がmicroSDカードへのデータの保存を設定している部分です。これはデータを保存するファイル名になりますので、センサーの設置場所などのわかりやすいファイル名にしましょう。またファイルの拡張子は`.csv`としてください。この部分を`""`とすると、microSDカードへはデータが保存されなくなります。）

さて、microSDカードのなかに保存されたデータに、いまアクセスするためには、一度Raspberry Pi Zeroの電源を切り、また電源をいれて起動させ、すこし時間をおいて（３，４分以上）さらにもう一度電源を切るというステップを経る必要があります。そのようにしてから、microSDカードをパソコンに差し替えます。

そして、microSDカードの`/boot/setting/log`フォルダを確認してみましょう。そのなかに`○○○.csv`というファイルができていますか？

`/boot/setting/log/`には環境センサーなどのpizero-workshopプログラムによる記録データが保存されます。しかしプログラムの事情から、通常はおそらく最新の記録データはみつからないでしょう。その場所には午前０時やシステム起動時に、ある別の場所に保存されているデータがコピーされるのです。したがって、mircoSDカードから最新のデータにアクセスしたい場合は、さきほどのように一度Raspberry Pi Zeroを再起動をさせてコピーされるのをしばらく待ち、そして電源を切ってmicroSDカードへアクセスする必要があります。

また、長期間にわたり計測データを記録すると、１週間おきに、古いcsvデータが自動でファイル分割され、ファイル名に古い日付の付いたcsvファイルが自動生成されるようになっています。

>ちなみにcsvとは`comma separated values`のことです。つまり「カンマで区切られた値」としてデータを表現し保存する形式です。そのデータが一行一行追記されるので、データ全体は表のようになります。Excelなどの表計算ソフトであつかうのに適したデータ形式です。

### Googleドライブにアップロードする

csvファイルを、定期的にgoogleドライブに自動でアップロードすることができます。

まずrcloneというソフトウェアの設定ファイルが必要です。この設定ファイルがない場合は、まずお使いのコンピュータに`rclone`をインストールしてください。rcloneを起動してgoogleドライブを使う設定をすると、rcloneの設定ファイルが生成されます。そしてこの設定ファイルをRaspberry Pi Zero のmicroSDカードの`/boot/setting`の中に`rclone.conf`というファイル名でコピーします。

次に `/boot/setting/syncLogConfig.js `ファイルを編集します。

```js
module.exports = [
  {
    type: 'rsync',
    intervalHours: 1,
    source: '/home/pi/pizero-workshop/log/',
    dest: '/boot/setting/log/'
  }
  ,
  {
    type: 'rclone',
    intervalHours: 24,
    rcloneConf: '/boot/setting/rclone.conf',
    source: '/boot/setting/log',
    destService: 'gdrive', //ここをrcloneの設定ファイルの生成のときに入力したgoogle driveに対するサービス名に変更する
    destDir: 'pizero-workshop'
  }
];
```

`syncLogConfig.js`ファイルを以上のように編集します。
