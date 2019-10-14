'use strict';

// This program is call by start.sh for checking values in syncLog configuration file. //

// process.argv[2] is syncLog configuration file path //
let config = require(process.argv[2]);

let err = [];

try{
  if(config){
    if(!Array.isArray(config)){
      err.push('設定はオブジェクトの配列である必要があります。');
    }else{
      config.forEach((c)=>{
	if(c.type=='rsync'){
	  if(!(typeof c.intervalHours === 'number' &&　c.intervalHours > 0 &&　Math.round(c.intervalHours) === c.intervalHours)) err.push('rsyncのintervalHoursに１以上の整数を設定してください（必須項目です）。');
	  if(!c.source) err.push('rsyncにsourceが設定されていません（必須項目です）。');
 	  if(!c.dest) err.push('rsyncにdestが設定されていません（必須項目です）。');
	}
	if(c.type=='rclone'){
	  if(!(typeof c.intervalHours === 'number' &&　c.intervalHours > 0 &&　Math.round(c.intervalHours) === c.intervalHours)) err.push('rcloneのintervalHoursに１以上の整数を設定してください（必須項目です）。');
	  if(!c.rcloneConf) err.push('rcloneにrcloneConfが設定されていません（必須項目です）。');
	  if(!c.source) err.push('rcloneにsourceが設定されていません（必須項目です）。');
 	  if(!c.destService) err.push('rcloneにdestServiceが設定されていません（必須項目です）。');
	  if(!c.destDir) err.push('rcloneにdestDirが設定されていません（必須項目です）。');
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
