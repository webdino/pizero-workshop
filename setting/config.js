/*
This is pizero-workshop config.js.

The configuration of single or mulitiple sensing and records are available as array of each setting objects.
Please fill the values of some properties (sensing and records interval time, sensor info, csv file path, machinist acount info, and ambient acount info).

これはpizeroワークショップの設定ファイルです。

１つ以上の環境センサーからデータを集めて、それらをクラウドサービスにアップロードすることが出来ます。（ローカルcsvファイルに保存することも出来ます。）
以下に、それぞれの環境センサーごとに、そのアドレスとcsvファイル保存とクラウドアップロードに関する設定を記述してください。（環境センサー１つの場合はfirst settingの部分だけでよいです）

環境センサーのアドレスを、omron2jcieBu01Addressに記述します。（必須）
データをcsvファイルに出力する場合は、そのファイル名をcsvFilenameに記述します。（任意）
データをMachinistに送信する場合は、machinistApiKeyとmachinistAgentの両方を記述します。（任意）
データをAmbientに送信する場合は、ambientChannelIdとambientWriteKeyの両方を記述します。（任意）
記述は２つのダブルクォーテーション""の間にしてください。

*/

module.exports = [
  //first setting
  {
    intervalMillisec: 60000, //sensing and record interval (milli second)

    //have to filled belows to sensing
    omron2jcieBu01Name: "Rbt", //maybe fix "Rbt"
    omron2jcieBu01Address: "", //12 charactors of number or aphabet (like "A1B2C3D4E5F6")

    //if filled below, saving csv file
    csvFilename: "", //csv file name for saving sensing data. if value is "", not saving.

    //if filled belows, uploading to Machinist
    machinistApiKey: "", //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistAgent: "", //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistBatchQuantity: 1, //number of temporary stock the sensing data before sending

    //if filled belows, uploading to Ambient
    ambientChannelId: "", //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambientWriteKey: "", //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambientBatchQuantity: 1, //number of temporary stock the sensing data before sending

    webAgent: {
      enable: false, // Enable local server (default: false).
      /** @type {({ temperature, relativeHumidity, barometricPressure, ambientLight, soundNoise, eTVOC, eCO2 }) => boolean} */
      notifyWhen: ({ temperature }) => temperature > 25
    },
    speechAgent: {
      enable: false, // Enable talk mode (default: false).
      /** @type {({ temperature, relativeHumidity, barometricPressure, ambientLight, soundNoise, eTVOC, eCO2 }) => boolean} */
      notifyWhen: ({ temperature }) => temperature > 25,
      /** @type {({ temperature, relativeHumidity, barometricPressure, ambientLight, soundNoise, eTVOC, eCO2 }) => string} */
      notifyScript: ({ temperature }) => `現在の温度は${temperature}度です。`
    }
  },

  //second setting
  {
    intervalMillisec: 60000, //sensing and record interval (milli second)

    //have to filled belows to sensing
    omron2jcieBu01Name: "Rbt", //maybe fix "Rbt"
    omron2jcieBu01Address: "", //12 charactors of number or aphabet (like "A1B2C3D4E5F6")

    //if filled below, saving csv file
    csvFilename: "", //csv file name for saving sensing data. if value is "", not saving.

    //if filled belows, uploading to Machinist
    machinistApiKey: "", //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistAgent: "", //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistBatchQuantity: 1, //number of temporary stock the sensing data before sending

    //if filled belows, uploading to Ambient
    ambientChannelId: "", //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambientWriteKey: "", //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambientBatchQuantity: 1 //number of temporary stock the sensing data before sending
  },

  //third setting
  {
    intervalMillisec: 60000, //sensing and record interval (milli second)

    //have to filled belows to sensing
    omron2jcieBu01Name: "Rbt", //maybe fix "Rbt"
    omron2jcieBu01Address: "", //12 charactors of number or aphabet (like "A1B2C3D4E5F6")

    //if filled below, saving csv file
    csvFilename: "", //csv file name for saving sensing data. if value is "", not saving.

    //if filled belows, uploading to Machinist
    machinistApiKey: "", //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistAgent: "", //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistBatchQuantity: 1, //number of temporary stock the sensing data before sending

    //if filled belows, uploading to Ambient
    ambientChannelId: "", //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambientWriteKey: "", //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambientBatchQuantity: 1 //number of temporary stock the sensing data before sending
  }

  //more settings (fourth, fifth, ...) are available in following space with comma and setting objects like above.
];
