## 基本的な使い方

### 必要なもの

本ワークショップの実施には最低限、次のものが必要です。詳しくは [詳細と購入先の説明ページ](purchase.md) をご覧ください。

- Raspberry Pi Zero 本体と microSD カード
- パソコン (Windows / macOS / Chromebook など) と SD カードリーダー
  - SD カードの読み書きが可能なスマートフォンやタブレットなどでも可能ですが、ここでは扱いません。
- 環境センサー [Omron 2JCIE-BU01](https://www.omron.co.jp/ecb/product-info/sensor/iot-sensor/environmental-sensor)
- Raspberry Pi Zero および環境センサーの USB 電源

### 事前準備

まずはじめに、Raspberry Pi Zero を起動させるためには、OS（Rapbian Buster）をインストールし、本ワークショップ用プログラムをセットアップした microSD カードの準備が必要です。これは講師の方で [セットアップ手順ページ](usage/index.md) に従って事前に準備してください。

## クラウドサービスアカウントの作成

定期的に環境センサから取得したデータは、その都度クラウドサービスにアップロードします。

まずはその準備をしましょう。

IIJ の IoT データ可視化クラウドサービス [Machinist (マシニスト)](https://app.machinist.iij.jp/) で [ユーザアカウントの新規登録](https://app.machinist.iij.jp/login) をしてください。アカウント登録に必要なものはメールアドレスのみです (クレジットカードなどは有償プラン利用時にのみ必要)。

ユーザアカウントの登録が完了したらログインします。

ダッシュボードのページで、その画面右上のメールアドレス部分をクリックして、「アカウント設定」にアクセスしてください。

**アカウント設定のページには、API キーが表示されています。** プログラムではこの API キーを使ってユーザの認証を行い、センサーデータを Machinist にアップロードします。このあと microSD カードに書き込んで、Raspberry Pi Zero から Machinist へデータをアップロードできるよう設定します。API キーがあれば誰でもデータが書き込めるので、**API キーは誰にも教えないように**してください。

## microSD カードの編集

それではいよいよパソコンで microSD カードを編集していきます。カードの中にある `bootWifiConfig.js` に WiFi 接続先の設定を、`config.js` にセンサーを識別するアドレスとデータを送信する Machinist の API キーを書き込みます。

まず、パソコンに microSD カードを挿入しましょう。Windows / macOS / Chromebook それぞれのユーザ別に説明します。

#### Windows の場合

1. パソコンに SD カードを挿入します。
2. 「boot このドライブで問題がみつかりました。今すぐドライブを・・・」と右下に表示されますが構いません。
3. そしてここからが注意です。さらに、「ドライブを使うにはフォーマットする必要があります。フォーマットしますか？」とアラートがポップアップされるので、ここは**必ず「キャンセル」を選択してください**。
    - 誤ってフォーマット (初期化) してしまうと SD カードの中身が全て空になってしまうので注意してください！
4. エクスプローラー（普段よく使うファイルやフォルダ一覧を表示するもの）の左のエリアに boot というドライブがあらわれます。その中に `setting` フォルダ、さらにその中に `bootWifiConfig.js` と `config.js` の 2 つのファイルがあることを確認します。
5. `bootWifiConfig.js` をクリックして選択し、さらに右クリックしてメニューから「プログラムから開く」を選択、そして「[TeraPad](https://tera-net.com/library/tpad.html)」などのプログラムファイルの編集に適したテキストエディタ（メモ帳でもよいです）を選択し、ファイルを開きます。
<!--     - Windows 標準のテキストファイル編集ソフト (テキストエディタ) **「メモ帳」では開かないでください！** メモ帳は Raspberry Pi で使用するテキストファイル形式 (文字コードと改行コードの種類) に対応できず、正しく動作しなくなります (将来改善予定)
 -->
6. 同様に `config.js` も開きます。
<!-- 7. テキストエディタで **「保存文字コード」は「UTF-8」に、「保存改行コード」は「LF」に設定します**。TeraPad の場合、[「表示」 > 「オプション」メニューを開き](images/TeraPad_option.png)、[「文字コード」タブで](images/TeraPad_UTF8_LF.png)、「保存文字コード」を「UTF-8」に、「保存改行コード」を「LF」に設定します (設定画面はリンク先参照)。
 -->
#### macOS の場合

1. パソコンに SD カードを挿入します。
2. Finder（ファインダー）にbootデバイスがあらわれます。そのなかに`setting`フォルダ、さらにそのなかに`bootWifiConfig.js`と`config.js`の２つのファイルがあることを確認します。
3. `bootWifiConfig.js`をクリックして選択し、さらに右クリックして「このアプリケーションで開く」から「テキストエディット」を選択し、ファイルを開きます。
4. 同様に`config.js`も開きます。

#### Chromebook の場合

1. パソコンに SD カードを挿入する
2. ファイルのアプリを開く
3. 該当するファイルを開く
  - Text アプリが開かない場合、ファイルを選択後、右クリックのメニューから「アプリケーションで開く…」を選択し、Text で開く

---

ファイルを開いたら、２つのファイルそれぞれを以下の様に編集していきましょう。

### WiFi 接続の設定 (bootWifiConfig.js)

まずはインターネット接続させるため **WiFi 接続先を `bootWifiConfig.js` に次のように書き込みます**。

```js
module.exports = [
  {ssid: "AAA", passphrase: "XXX"}
  ,
  {ssid: "BBB", passphrase: "YYY"}
  ,
  {ssid: "CCC", passphrase: "zzz"}
  ,
  {ssid: "", passphrase: ""}
  ,
  {ssid: "", passphrase: ""}
];
```

<!-- 接続する WiFi スポットの **SSID とパスワードを半角カンマ `,` で区切って書きます**。
 -->
 複数の WiFi スポットを接続候補にしたいときは、**上から接続優先順に書きます**。
<!-- なおこのファイルは、Raspberry Pi Zero の起動後に、正常に WiFi 設定が完了すると自動で内容が空っぽになります。
 -->
> `bootWifiConfig.js` の書き方に**誤りがあった場合**、Raspberry Pi Zero 起動時に WiFi 設定は更新されず以前の WiFi の設定のままとなります。<!-- この場合 **`wifi.txt` ファイルはそのまま残ります**。   -->
> `bootWifiConfig.js` の書き方に**誤りが無かった場合**、起動時に WiFi 設定は一度全部クリアされ、新たな WiFi 設定で置き換えられます。<!-- この場合 **`bootWifiConfig.js` ファイルは空になります**。WiFi パスワードをそのまま保存しないためです。
 -->
### データ収集プログラムの設定 (config.js)

続いて、データ収集・送信プログラムの設定ファイル `config.js` です。**環境センサのアドレスとデータ送信先クラウドサービスの API キーを指定**しましょう。

```js
module.exports = [

  {
    intervalMillisec: 60000,    //sensing and record interval (milli second)

    //have to filled belows to sensing
    omron2jcieBu01Name: "Rbt", //maybe fix "Rbt"
    omron2jcieBu01Address: "", //12 charactors of number or aphabet (like "A1B2C3D4E5F6")

    //if filled below, saving csv file 
    csvFilename: "",           //csv file name for saving sensing data. if value is "", not saving.

    //if filled belows, uploading to Machinist
    machinistApiKey: "",       //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistAgent: "",        //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistBatchQuantity: 1, //number of temporary stock the sensing data before sending

    //if filled belows, uploading to Ambient
    ambientChannelId: "",      //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambientWriteKey: "",       //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambientBatchQuantity: 1    //number of temporary stock the sensing data before sending
  }

];
```

`omron2jcieBu01Address:` の右の部分に、**環境センサ（Omron 2JCIE-BU01）のアドレス（数字と大文字アルファベット12桁）をすべて半角で入力**します。アドレスは環境センサー付属のシールに記載されています。

`machinistApiKey:` の右の部分には、**Machinist の「アカウント設定」画面に表示される API キーを入力**します。デフォルトで表示されている API キーをそのままか、今回のワークショップ用に追加するかいずれでも構いません。

表示されている API キーの右に「クリップボードにコピー」するボタンがあるのでコピーして、`coonfig.js` の `machinistApiKey:` の値にペーストしてください (上記の例では xxxxx となっている部分です)。手入力の場合は入力ミスがないかよく確認してください。

`machinistAgent:` の右の部分には、自分で決めたわかりやすい単語などを書きます。センサーの設置場所などを記述するとよいでしょう。これは自動でMachinistのエージェント名になります。

`csvFilename:` の右の部分にも、同様に自分で決めたわかりやすい単語などを書きます。こちらも同様にセンサーの設置場所を記述するのがよいでしょう。これは自動でmicroSDカードに保存されるcsvファイルの名前になります。`xxx.csv`というように`.csv`という拡張子をつけるようにしてください。


とくに、コロン `:` やセミコロン `;`、カンマ `,` やピリオド `.` 、クオート (一重引用符) `'` とダブルクォート (二重引用符) `"` 、カッコの種類 `[] {} ()`、そしてスラッシュ `/` の数などは注意深くみましょう。（これらの記号文字は、プログラミングではそれぞれが１文字の違いが重要です。ちなみにこの `config.js` ファイルは JavaScript のプログラムファイルです。）

正しく入力できたらファイルを上書き保存し、microSD カードを安全に取り外します。

#### Windows の場合

1. 開いているテキストエディタで「保存（save）」します。
2. エクスプローラーで「bootドライブ」を選択し、右クリックでメニューを表示して、「取り出し」を選択します。
3. 「ハードウェアの取り出し - bootはコンピュータから安全に取り外すことが出来ます」と表示されるのを確認して、パソコンからmicroSDカードを取り外します。

#### macOS の場合

1. 開いているテキストエディットで「保存（save）」します。ここで「書類`config.js`があるボリュームは、バージョン履歴の保存には対応していません・・・」など表示されるかもしれませんが構いません。
2. Finder（ファインダー）で「boot」すぐ横の取り外しマークをクリックして、「boot」の表示が消えたら、パソコンからmicroSDカードを取り外します。

#### Chromebook の場合

1. ファイルのアプリを開く
2. デバイスの取り出しを選択する 

さあ、これで準備はOKです。

## 環境センシングとデータアップロードの開始

それでは、microSDカードをRaspberry Pi Zero本体に挿入して、電源を入れてみましょう。
<!-- TODO: 配線図と説明が必要 -->

Raspberry Pi Zero本体のLEDが点灯し、ときどきすばやく点滅していたら、正常に起動が始まっています。
<!-- TODO: 何処の LED か分かるように。点灯してないときは何処見れば良いか分からないので -->

そして待つこと１、２分。では、Web ブラウザで Machinist のメトリックを開いて、時々ページをリロードしてみましょう。

セットアップ済みのOSイメージを使っている場合、 **初回起動時だけは更に 2〜3 分 (SD カードの速度次第) は我慢して待ってください**。初回起動時に SD カードのサイズに合わせてパーティーション (ディスクの使用領域の設定) を拡張して再起動するため時間が掛かります。この途中で電源を切ってしまうと SD カードのパーティーションが破損して二度と起動しなくなってしまいます。

もし数分待っても Machinist にデータが追加されない場合、以下のようにしてもう一度チェックしてみます。

Raspberry Pi Zero本体の LED が点滅状態でないときに、Rapberry Pi Zeroから電源を抜きます。

そしてもう一度 microSD カードをパソコンに挿入して中身を確認します。

- `bootWifiConfig.js` の ssid とパスフレーズは間違っていないか
- `bootWifiConfig.js` は正しく入力できているか
  - **二重引用符 `"` や半角カンマ `,`** を消してしまっていないか
- `config.js` は正しく入力できているか
  - **二重引用符 `"` や半角カンマ `,`** を消してしまっていないか
  - `omron2jcieBu01Address:` 12 桁は正しく入力されているか。本当に自分が使っているセンサーのアドレスか
  - `omron2jcieBu01Address:` は英数字以外に `:` (コロン) を含めていないか (アドレス確認ソフトによっては `:` 区切りで表示されるが省略して入力する)
- 全て半角で入力されているか。全角文字を含めていないか。全角空白文字も含まれていないか。
- 誤ってファイル名を変更していないか。ファイルの保存ディレクトリを移動してしまっていないか

上手くいったら、次は [応用編: もっと便利につかってみよう](advanced-usage.md) にいってみましょう。
