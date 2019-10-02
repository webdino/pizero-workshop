let config = require(process.argv[2]);

let err = [];

try{
  if(config){
    if(!Array.isArray(config)){
      err.push('設定はオブジェクトの配列である必要があります。');
    }else{
      config.forEach((c)=>{
	if(c.type=='rsync'){
	  if(!c.intervalHours) err.push('rsyncにintervalHoursが設定されていません（必須項目です）。');
	  if(!c.source) err.push('rsyncにsourceが設定されていません（必須項目です）。');
 	  if(!c.dest) err.push('rsyncにdestが設定されていません（必須項目です）。');
	}
	if(c.type=='rclone'){
	  if(!c.rcloneConf) err.push('rcloneConfにintervalHoursが設定されていません（必須項目です）。');
	  if(!c.intervalHours) err.push('rcloneにintervalHoursが設定されていません（必須項目です）。');
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
  //console.log('チェックは正常に終了しました。');
  process.exit(0);
}
