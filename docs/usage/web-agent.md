# Web Agent (計測値の画面表示機能)

![画面](../images/omron-iot-sensor-web-agent.png)

Web Agent をセットアップすると、環境センサー (OMRON 2JCIE-BU) から得られた現在の値をディスプレイ上に表示できます。

## セットアップ

事前に HDMI ディスプレイ (または Raspberry Pi 用ディスプレイ) と Raspberry Pi 本体を含むデータ収集環境一式を準備します。
[基本的な使い方](../basic-usage.md) と [利用機材情報](../purchase.md) ページを参考にしてください。

現在の値を画面上に表示するためには、以下の 3 つを実施します。

1. ディスプレイを Raspberry Pi に接続
2. Web Agent の有効化
3. 再起動

ここでは Web Agent の有効化する方法を詳しく説明します。

## Web Agent の有効化

microSD カードの中にある、設定ファイル config.js を書き換えます。
config.js の書き換え方は [基本的な使い方](../basic-usage.md) を参考にしてください。
次のコードのように、webAgent.enable を `true` に書き換えましょう。

```js
module.exports = [
  {
    // ...
    ,
    webAgent: {
      enable: true,
    }
  }
];
```

以上で、次回再起動後、Raspberry Pi が自動的にブラウザを起動し、現在の計測値を表示する Web サーバ (http://localhost:3000) のページを開いて、画面上に最新の計測値を表示するようになります。

### 特定条件を満たしたときに通知する設定

計測した値がある条件を満たすとき、画面全体を白黒に点滅させることにより視覚的に通知することができます。
例えば、温度が 25℃ を超えた時、画面を点滅させるには、以下のように webAgent.notifyWhen を書き加えます。

```diff
        enable: true,
+       notifyWhen: ({ temperature }) => temperature > 25
```

```js
module.exports = [
  {
    // ...
    ,
    webAgent: {
      enable: true,
      notifyWhen: ({ temperature }) => temperature > 25
    }
  }
];
```

設定の記述方法について詳しくは下記「機能と実装の詳細」を参照してください。

### Web Agent を無効化するには

config.js の webAgent.enable を `false` にします。

```js
module.exports = [
  {
    // ...
    ,
    webAgent: {
      enable: false
    }
  }
];
```

## 機能と実装の詳細

- 設定ファイル config.js は pizero-workshop.js と omron-iot-sensor-web-agent によって読み込む
- pizero-workshop.js に関するドキュメントは、[pizero-workshop for developers](index.md) を参照
- omron-iot-sensor-web-agent は環境センサー (OMRON 2JCIE-BU) から得られた値を Web ページとして配信するためのモジュール
- インターネットに接続することなくローカル環境で表示することが可能

### キオスクモードの有効化

起動後、画面を全画面で表示するようにするためにキオスクモードを有効化するには、ターミナルで次のコマンドを実行してください。

~/pizero-workshop ディレクトリにある install.sh の実行:

```sh
sudo ~/pizero-workshop/install.sh -setupKiosk
```

#### キオスクモードを無効化するには

次のコマンドを実行します。

```sh
sudo ~/pizero-workshop/install.sh -teardownKiosk
```

### 通知設定

ある特定の条件で画面を点滅させるには、 webAgent.notifyWhen で設定することが可能です。
webAgent.notifyWhen には、[JavaScript の関数式](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Arrow_functions) を与えましょう。
この関数は計測する度に実行されます。この関数の戻り値が `true` (真) のとき、通知が画面に送られ、画面が点滅します。

引数には計測値を含むオブジェクトが得られます。オブジェクトに含まれるパラメーターは、次のとおりです。

| パラメーター       | 型     | 単位 | 説明                   |
| ------------------ | ------ | ---- | ---------------------- |
| temperature        | number | ℃    | 温度                   |
| relativeHumidity   | number | %    | 相対湿度               |
| barometricPressure | number | hPa  | 大気圧                 |
| ambientLight       | number | lx   | 照度                   |
| soundNoise         | number | db   | 騒音                   |
| eTVOC              | number | ppb  | 総揮発性有機化合物濃度 |
| eCO2               | number | ppm  | 二酸化炭素濃度         |

webAgent.notifyWhen を省略すると、デフォルトではいかなる場合も画面を点滅する通知は行われません。

### 環境変数

| 環境変数 | 説明                            |
| -------- | ------------------------------- |
| PORT     | ポート番号、デフォルトでは 3000 |

/etc/systemd/system/pizero-workshop.service に Environment を書き加えることで変更可能です。

例:

```diff
  [Service]
+ Environment=PORT=80
```
