##やってみよう! micro SDカードの編集だけでできる IOT環境データ収集

###必要なもの

- Raspberry pi zero 本体とmicroSDカード(16GBぐらいの新品)
- window / mac / chromebookなどのパソコンとSDカードリーダー（パソコンに内蔵ならなくてもOK）
- 環境センサー（いまのところは[Omron2JCIE-BU01]()のみです）

###前準備その１

まずはじめに、Raspberry Pi Zero を起動させるために、OS（Rapbian Buster）がインストールされたmicroSDカードが必要です。また環境センシングとデータ収集をおこなうためには、そこにpizero workshopプログラムがセットアップされている必要があります。

次のどちらかを選んで、それを準備しましょう。

- [セットアップ済みOS (Raspbian Buster)イメージをつかう（初心者におすすめ）]()
- [Raspbian Busterに自分でセットアップする（くわしい人向け）]()


###前準備その２
環境センサから取得したデータは、クラウドサービスにアップロードします。

ここからはその準備をします。

[Machinistでユーザアカウントをつくる]()の手順に沿って進めます。

<!--[Machinistでユーザアカウントをつくる]()か、[Ambientでユーザアカウントをつくる]()のどちらかを選び（両方でもよい）手順に沿って進めます。
-->

###microSDカードの編集

前準備はOK？

ではいよいよパソコンでmicroSDカードを編集します。

まずはファイルを開きます。

ここはwindows/mac/chromebookそれぞれのユーザ別に説明します。

---

#####windows
>パソコンにsdカードを挿入する。
「フォーマットしますか？」とアラートがポップアップするので、必ず「キャンセル」を選択する。
`setting`フォルダのなかにある、`wifi.txt`と`config.js`を確認する。
プログラミング用のエディタ（TeraPadなど）で両方のファイルを開く。

#####mac
>パソコンにsdカードを挿入する

#####chromebook
>パソコンにsdカードを挿入する

---

さて、ファイルを開いたら、それぞれを以下の様に編集しましょう。

######wifi.txt
```
ssid,passphrase
ssid,passphrase
ssid,passphrase
```
接続するwifiスポットのssidとパスワードをカンマで区切って書きます。
複数のwifiスポットを接続候補にしたいときは、上から一行づつ、接続優先順に書きます。
なおこのファイルは、raspberry pi zero の起動後に、自動で内容が空っぽになります。

######config.js
```js
module.exports = {
  NAME: "Rbt",
  ADDRESS: "XXXXXXXXXXXX",
  INTERVAL_MILLISEC: 60000,
  RECORDS: ["CSV", "MACHINIST"],
  //RECORDS: ["CSV", "AMBIENT"],
  //RECORDS: ["CSV", "MACHINIST", "AMBIENT"],
  MACHINIST_API_KEY: "xxxxxxxxxxxxxx",
  MACHINIST_MULTIPLE: 1,
  AMBIENT_CHANNEL: x,
  AMBIENT_WRITE_KEY: "yyyyyyyyyyyyyyyy",
  AMBIENT_MULTIPLE: 1
};
```
`ADDRESS:` の右の部分に、環境センサ（Omron2JCIE-BU01）のアドレス。
`MACHINIST_API_KEY:` の右の部分に、Machinistのユーザ登録で取得したAPIキー。
まずはこの２つを入力します。

ミスがないかよく確認して、大丈夫ならファイルを上書き保存します。

さあこれで準備OK。
###センシングとアップロードの開始
おまたせしました。

それでは、microSDカードをRaspberryPiZero本体に挿入して、電源を入れてみましょう。

そして待つこと1,2分…どうですか？

うまくいってますか？

うまくいってなさそうなら以下を確認してみましょう。
- 設定ファイルに全角文字を含めていないか？
- `wifi.txt`のssidとpassphraseは間違っていないか？
- 

###設定応用編
ここからは、さらに便利につかっていくための説明をしていきます。

interval_millisec
multiple 

machinist alert etc

ambient  [Ambientでユーザアカウントをつくる]()の手順に沿って進めます。

csv　と　ログローテート
google driveの設定　　rclone

raspberrypi zeroへアクセス
ここからはくわしい人向けになりますが、hostname otg serial_console