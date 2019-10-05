let config = require(process.argv[2]);

let err = [];

try {
  if(!config) err.push('何も設定されていません（設定必須です）。');
  config && config.forEach((c)=>{
    Object.keys(c).forEach((key)=>
			   ['intervalMillisec',
			    'omron2jcieBu01Name',
			    'omron2jcieBu01Address',
			    'csvFilename',
			    'machinistApiKey',
			    'machinistAgent',
			    'machinistBatchQuantity',
			    'ambientChannelId',
			    'ambientWriteKey',
			    'ambientBatchQuantity'].indexOf(key) == -1 && err.push(`${key}は誤った設定項目です。`));

    if(!c.intervalMillisec) err.push('interval_millisecが設定されていません（必須項目です）。');
    if(typeof c.intervalMillisec != 'number' || c.intervalMillisec < 1000) err.push('interval_millisecは1000以上の数値である必要があります。');

    if(!(c.omron2jcieBu01Name && c.omron2jcieBu01Address)) err.push('omron2jcieBu01Nameとomron2jcieBu01Addressの設定は必須です。');
    //if(c.omron2jcieBu01Name != "Rbt") err.push('');
    if(c.omron2jcieBu01Address.length != 12) err.push('omron2jcieBu01Addressが１２文字ではありません。');
    if(!c.omron2jcieBu01Address.match(/^[A-Z0-9]*$/)) err.push('omron2jcieBu01Addressがアルファベット大文字か数字でありません。');
       
    //if(c.csvFilename) err.push('csvが設定されていません（必須項目です）。');

    if(c.machinistApiKey || c.machinistAgent){
      if(!c.machinistApiKey) err.push('machinistApiKeyが設定されていません（Machinistを使用するなら必須項目です）。');
      if(typeof c.machinistApiKey != "string") err.push('MachinistApiKeyは文字列である必要があります。');
      
      if(!c.machinistAgent) err.push('machinistAgentが設定されていません（Machinistを使用するなら必須項目です）。');
      if(typeof c.machinistAgent != "string") err.push('MachinistAgentは文字列である必要があります。');

      if(!c.machinistBatchQuantity) err.push('machinistBatchQuantityが設定されていません（Machinistを使用するなら必須項目です）。');
      if(typeof c.machinistBatchQuantity != 'number' || c.machinistBatchQuantity < 1) err.push('machinistBatchQuantityは1以上の整数である必要があります。');

    }

    if(c.ambientChannelId || c.ambientWriteKey){
      if(!c.ambientChannelId) err.push('ambientChannelIdが設定されていません（Ambientを使用するなら必須項目です）。');
      if(!c.ambientWriteKey) err.push('ambientWriteKeyが設定されていません（Ambientを使用するなら必須項目です）。');
      if(!c.ambientBatchQuantity) err.push('ambientBatchQuantityが設定されていません（Ambientを使用するなら必須項目です）。');
    }
    
  });
} catch (e) {
  console.error(err.join("\n"));
  console.error(e);
  process.exit(1);
}

if(err.length > 0){
  console.error(err.join("\n"));
  process.exit(1);
}else{
  console.log('設定項目のチェックは正常に終了しました。');
  process.exit(0);
}
