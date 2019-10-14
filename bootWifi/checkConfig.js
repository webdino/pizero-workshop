'use strict';

// This program is call by bootWifi.sh for checking values in wifi configuration file. //

// process.argv[2] is wifi configuration file path //
let config = require(process.argv[2]);

let err = [];

try {
  if(config){
    if(!Array.isArray(config)){
      err.push('設定はオブジェクトの配列である必要があります。');
    }else{
      config.forEach((c)=>{
	if(c.ssid || c.passphrase){
	  if(!c.ssid) err.push('ssidが設定されていません（必須項目です）。');
	  if(typeof c.ssid != "string") err.push('ssidは文字列である必要があります。');
	  if(!c.passphrase) err.push('passphraseが設定されていません（必須項目です）。');
	  if(typeof c.passphrase != "string") err.push('passphraseは文字列である必要があります。');
	}
      });
    }
  }
}catch(e){
  console.error(err.join("\n"));
  console.error(e);
  process.exit(1);
}

if(err.length > 0){
  console.error(err.join("\n"));
  process.exit(1);
}else{
  process.exit(0);
}
