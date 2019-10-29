# speechAgent

speechAgent のセットアップを行うことで、環境センサー (OMRON 2JCIE-BU) から得られた現在の値をスピーカーで読み上げることが出来ます。

## セットアップ方法

前提として、事前にスピーカー、HDMI ディスプレイ (または、音声出力可能な USB デバイス)、 Raspberry Pi 本体を含むデータ収集環境一式を準備します。
[SD カードの編集だけでできる IoT 環境データ収集](../Workshop)のページを参考にしてください。

現在の値をスピーカーで読み上げるには、以下の 3 つを実施します。

1. スピーカーを Raspberry Pi に接続
2. speechAgent の有効化
3. 再起動

ここでは speechAgent の有効化する方法を詳しく説明します。

## speechAgent の有効化

microSD カードの中にある、設定ファイル config.js を書き換えます。
config.js の書き変える方法は[SD カードの編集だけでできる IoT 環境データ収集](../Workshop)のページを参考にしてください。
次のコードのように、speechAgent.enable を `true` に書き換えましょう。

```js
module.exports = [
  {
    // ...
    ,
    speechAgent: {
      enable: true,
    }
  }
];
```

以上で、次回再起動後、現在の値を読み上げる音声が繰り返し出力されるようになります。

### ある条件のときのみ読み上げる設定

計測した値がある条件を満たすときだけ読み上げることが可能です。
例えば、温度が 25℃ を超えた時だけ読み上げるには、以下のように speechAgent.notifyWhen を書き加えます。

```diff
        enable: true,
+       notifyWhen: ({ temperature }) => temperature > 25,
```

```js
module.exports = [
  {
    // ...
    ,
    speechAgent: {
      enable: true,
      notifyWhen: ({ temperature }) => temperature > 25,
    }
  }
];
```

詳しくは開発者向け補足を参照してください。

### 読み上げる内容の設定

読み上げる文を変更することが可能です。
例えば、「現在の温度は 25 度です。」と読み上げるには、以下のように speechAgent.notifyScript を書き加えます。

```diff
        enable: true,
+       notifyScript: ({ temperature }) => `現在の温度は${temperature}度です。`,
```

```js
module.exports = [
  {
    // ...
    ,
    speechAgent: {
      enable: true,
      notifyScript: ({ temperature }) => `現在の温度は${temperature}度です。`,
    }
  }
];
```

詳しくは開発者向け補足を参照してください。

### speechAgent を無効化するには

config.js の speechAgent.enable を `false` にします。

```js
module.exports = [
  {
    // ...
    ,
    speechAgent: {
      enable: false
    }
  }
];
```

## 開発者向け補足

- 設定ファイル config.js は pizero-workshop.js と omron-iot-sensor-speech-agent によって読み込む
- pizero-workshop.js に関するドキュメントは、[pizero-workshop for developers](pizero-workshopForDevelopers)を参照
- omron-iot-sensor-speech-agent は環境センサー (OMRON 2JCIE-BU) から得られた値を音声出力として読み上げるモジュール
- インターネットに接続することなくローカル環境で読み上げることが可能

### HDMI モニターからの音声出力が機能しない

[https://elinux.org/R-Pi_Troubleshooting#Sound](https://elinux.org/R-Pi_Troubleshooting#Sound) を参照してください。

### 読み上げる条件の設定

ある特定の条件満たすときだけ読み上げるには、 speechAgent.notifyWhen で設定することが可能です。
speechAgent.notifyWhen には、[JavaScript の関数式](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Arrow_functions)を与えましょう。
この関数は計測する度に実行されます。
この関数の戻り値が `false` (偽) のとき、読み上げません。

引数には計測値を含むオブジェクトが得られます。
オブジェクトに含まれるパラメーターは、次のとおりです。

| パラメーター       | 型     | 単位 | 説明                   |
| ------------------ | ------ | ---- | ---------------------- |
| temperature        | number | ℃    | 温度                   |
| relativeHumidity   | number | %    | 相対湿度               |
| barometricPressure | number | hPa  | 大気圧                 |
| ambientLight       | number | lx   | 照度                   |
| soundNoise         | number | db   | 騒音                   |
| eTVOC              | number | ppb  | 総揮発性有機化合物濃度 |
| eCO2               | number | ppm  | 二酸化炭素濃度         |

speechAgent.notifyWhen を省略すると、デフォルトでは計測する度に読み上げます。

### 読み上げる内容の設定

ある特定の文字列を読み上げるには、 speechAgent.notifyScript で設定することが可能です。
speechAgent.notifyScript には、[JavaScript の関数式](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Arrow_functions)を与えましょう。
この関数は計測する度に実行されます。
この関数の戻り値の[文字列](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/template_strings)を読み上げます。

引数には計測値を含むオブジェクトが得られます。
オブジェクトに含まれるパラメーターは、次のとおりです。

| パラメーター       | 型     | 単位 | 説明                   |
| ------------------ | ------ | ---- | ---------------------- |
| temperature        | number | ℃    | 温度                   |
| relativeHumidity   | number | %    | 相対湿度               |
| barometricPressure | number | hPa  | 大気圧                 |
| ambientLight       | number | lx   | 照度                   |
| soundNoise         | number | db   | 騒音                   |
| eTVOC              | number | ppb  | 総揮発性有機化合物濃度 |
| eCO2               | number | ppm  | 二酸化炭素濃度         |

speechAgent.notifyScript を省略すると、デフォルトでは次の文字列を読み上げます。

`現在。温度${temperature}度。湿度${relativeHumidity}パーセント。大気圧${barometricPressure}ヘクトパスカル。照度${ambientLight}ルクス。騒音${soundNoise}デシベル。総揮発性有機化合物${eTVOC}ピーピービー。二酸化炭素濃度${eCO2}ピーピーエム。`
