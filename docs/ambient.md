

## Ambient にセンサーデータを送信する

[Machinist](https://machinist.iij.jp/) とは別のクラウドサービス、[Ambient](https://ambidata.io/) にもデータをアップロードすることができます。

ユーザアカウントを取得して、チャネルをつくり、そのチャネルの`チャネルID`と`ライトキー`を確認します。詳しくは [Ambient の説明ページ](https://ambidata.io/docs/gettingstarted/) をご覧ください。

そして再び、`config.js`ファイルの編集です。

`ambientChannelId: `に`チャネルID`の値を入力します。

`ambientWriteKey: `に`ライトキー`を入力します。

>javascriptプログラムでは、行頭に`//`を挿入すると、その行はプログラムとしては無視されます。これをコメントアウトといいまず。つまり`//`のあとにコメントとしてプログラムの説明をかいたり、一時的にその行を無視させるなどして、プログラムの変更を試すのに利用したりします。


