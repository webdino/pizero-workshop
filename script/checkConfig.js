let config = require(process.argv[2]);

let err = [];

try {
  if(!config.wifi) err.push('wifiが設定されていません（必須項目です）。');
  
  config.wifi && config.wifi.forEach((w)=>{
    if(!w.ssid) err.push('ssidが設定されていません（必須項目です）。');
    if(typeof w.ssid != "string") err.push('ssidは文字列である必要があります。');
    if(!w.passphrase) err.push('passphraseが設定されていません（必須項目です）。');
    if(typeof w.passphrase != "string") err.push('passphraseは文字列である必要があります。');
  });

  if(!config.omron2jcieBu01_Csv_Machinist) err.push('omron2jcieBu01_Csv_Machinistが設定されていません（必須項目です）。');
  config.omron2jcieBu01_Csv_Machinist && config.omron2jcieBu01_Csv_Machinist.forEach((c)=>{
    if(c.omron2jcieBu01Name != "Rbt") err.push();

    if(c.omron2jcieBu01Address.length != 12) err.push('addressが１２文字ではありません。');
    if(!c.omron2jcieBu01Address.match(/^[A-Z0-9]*$/)) err.push('addressがアルファベット大文字か数字でありません。');

    if(c.csvFile) err.push('csvが設定されていません（必須項目です）。');

    if(!c.machinistApikey) err.push('machinistApikeyが設定されていません（必須項目です）。');
    if(typeof c.machinistApikey != "string") err.push('machinistApikeyは文字列である必要があります。');
    
    if(!c.machinistAgent) err.push('machinistAgentが設定されていません（必須項目です）。');
    if(typeof c.machinistAgent != "string") err.push('machinistAgentは文字列である必要があります。');

    if(!c.machinistMultiple) err.push('machinistMultipleが設定されていません（必須項目です）。');
    if(typeof c.machinistMultiple != 'number' || c.machinistMultiple < 1) err.push('machinistMultipleは1以上の整数である必要があります。');

    if(!c.intervalMillisec) err.push('interval_millisecが設定されていません（必須項目です）。');
    if(typeof c.intervalMillisec != 'number' || c.intervalMillisec < 1000) err.push('interval_millisecは1000以上の数値である必要があります。');
    
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
