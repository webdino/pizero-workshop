let config = require(process.argv[2]);

let err = [];

try {
  if(!config.wifi) err.push('wifiが設定されていません（必須項目です）。');
  
  config.wifi && config.wifi.forEach((w)=>{
    if(typeof w.ssid) err.push('ssidが設定されていません（必須項目です）。');
    if(typeof w.ssid != "string") err.push('ssidは文字列である必要があります。');
    if(typeof w.passphrase) err.push('passphraseが設定されていません（必須項目です）。');
    if(typeof w.passphrase == "string") err.push('passphraseは文字列である必要があります。');
  });

  if(!config.omron2jcieBu01_Csv_Machinist) err.push('omron2jcieBu01_Csv_Machinistが設定されていません（必須項目です）。');
  config.omron2jcieBu01_Csv_Machinist && config.omron2jcieBu01_Csv_Machinist.forEach((c)=>{
    if(c.name != "Rbt") err.push();

    if(c.address.length != 12) err.push('addressが１２文字ではありません。');
    if(!c.address.match(/^[A-Z0-9]*$/)) err.push('addressがアルファベット大文字か数字でありません。');

    if(c.csv) err.push('csvが設定されていません（必須項目です）。');

    if(typeof c.apikey) err.push('agentが設定されていません（必須項目です）。');
    if(typeof c.apikey == "string") err.push('agentは文字列である必要があります。');
    
    if(typeof c.agent) err.push('agentが設定されていません（必須項目です）。');
    if(typeof c.agent == "string") err.push('agentは文字列である必要があります。');

    if(c.multiple) err.push('multipleが設定されていません（必須項目です）。');
    if(c.multiple > 0) err.push('multipleは1以上の整数である必要があります。');

    if(c.interval_millisec) err.push('interval_millisecが設定されていません（必須項目です）。');
    if(c.interval_millisec > 1000) err.push('interval_millisecは1000以上の数値である必要があります。');
    
  });
} catch (e) {
  console.error(e);
  process.exit(1);
}

if(err.length > 0){
  console.error(err.join("\n"));
  process.exit(1);
}else{
  console.error('config.jsのチェックは正常に終了しました。');
  process.exit(0);
}
