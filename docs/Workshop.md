## やってみよう! micro SDカードの編集だけでできる IOT環境データ収集

### 必要なもの

- Raspberry Pi Zero 本体とmicroSDカード(16GBぐらいの新品)
- window / mac / chromebookなどのパソコンとSDカードリーダー（パソコンに内蔵ならなくてもOK）
- 環境センサー（いまのところは[Omron2JCIE-BU01](https://www.omron.co.jp/ecb/product-info/sensor/iot-sensor/environmental-sensor)のみです）

### 前準備その１

まずはじめに、Raspberry Pi Zero を起動させるためには、OS（Rapbian Buster）がインストールされたmicroSDカードが必要です。

また環境センシングとデータ収集をおこなうために、そこにpizero workshopプログラムをセットアップする必要があります。

次のどちらかを選んで、それらを準備しましょう。

- [セットアップ済みOS (Raspbian Buster)イメージをつかう（初心者におすすめ）]()
- [Raspbian Busterに自分でセットアップする（くわしい人向け）]()


### 前準備その２
定期的に環境センサから取得したデータは、その都度クラウドサービスにアップロードします。

ここからはその準備をします。

[Machinistでユーザアカウントをつくる]()を手順に沿って進めます。

<!--[Machinistでユーザアカウントをつくる]()か、[Ambientでユーザアカウントをつくる]()のどちらかを選び（両方でもよい）手順に沿って進めます。
-->


### microSDカードの編集

前準備はOKですか？

それではいよいよパソコンでmicroSDカードを編集していきます。microSDカードの中にある`wifi.txt`と`config.js`の２つのファイルを編集します。

まずはパソコンにmicroSDカードを挿入しましょう。

ここからはwindows/mac/chromebookそれぞれのユーザ別に説明します。

---

##### windows
>パソコンにsdカードを挿入すると、「フォーマットしますか？」とアラートがポップアップするので、必ず「キャンセル」を選択してください。
そして`setting`フォルダのなかに`wifi.txt`と`config.js`があることを確認します。
プログラミング用のエディタ（TeraPadなど）でその２つのファイルを開きます。

##### mac
>パソコンにsdカードを挿入する

##### chromebook

1. パソコンにsdカードを挿入する
2. ファイルのアプリを開く
3. 該当するファイルを開く
  - Text アプリが開かない場合、ファイルを選択後、右クリックのメニューから「アプリケーションで開く…」を選択し、Text で開く

---

ファイルを開いたら、２つのファイルそれぞれを以下の様に編集しましょう。

###### wifi.txt
```
ssid,passphrase
ssid,passphrase
ssid,passphrase
```
接続するwifiスポットのssidとパスワードをカンマで区切って書きます。
複数のwifiスポットを接続候補にしたいときは、上から一行づつ、接続優先順に書きます。
なおこのファイルは、raspberry pi zero の起動後に、正常にwifi設定が完了すると自動で内容が空っぽになります。

TODO: wifi.txt を読み込んだら過去の設定を全て捨てて全上書きであることを明記

###### config.js
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
ファイル３行目の、`ADDRESS:` の右の部分に、環境センサ（Omron2JCIE-BU01）のアドレス（数字と大文字アルファベット１２桁）を入力します。

またファイル８行目の、`MACHINIST_API_KEY:` の右の部分には、Machinistのユーザ登録で取得したAPIキーを入力します。

TODO: どこから取得するかもっと細かな手順を記載。

入力ミスがないかよく確認して、大丈夫ならファイルを上書き保存します。

保存ができたら、microSDカードを取り外します。安全に取り外すために、以下のようにしてください。

##### windows
>右クリック　デバイスを安全に取り外す

##### mac
>

##### chromebook

1. ファイルのアプリを開く
2. デバイスの取り出しを選択する 

さあこれで準備はOK。

### 環境センシングとデータアップロードの開始

おまたせしました。

それでは、microSDカードをRaspberry Pi Zero本体に挿入して、電源を入れてみましょう。

…待つこと1,2分…どうですか？

TODO: 初回起動だけはパーティーション展開で少し時間が掛かると注意書き
TODO: Machinist のメトリックを開いて時々リロードさせること

うまくいってますか？

うまくいってなさそうなら以下をチェックしてみます。
- 設定ファイルに全角文字を含めていないか？
- `wifi.txt`のssidとpassphraseは間違っていないか？
- config.js ...

<!--どうでしょう、けっこう簡単にできたでしょう？

しばらくグラフをみていてなにか気づくことはないでしょうか？
-->

では、つづいて[もっと便利につかっていくための設定応用編](Workshop2ndPage.md)にいってみましょう。
