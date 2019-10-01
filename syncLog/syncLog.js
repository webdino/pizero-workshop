const execSync = require('child_process').execSync;
const once = process.argv[3] == '-execStop'

let config = require(process.argv[2]);

function syncLog(param){
  let timePoint = Date.now();
  try{
    switch(param.type){
    case 'rsync':
      const rsync = `/usr/bin/rsync -rlpt "${param.source}" "${param.dest}"`
      console.log(`rsync command: ${rsync}`);
      execSync(rsync);
      console.log('rsync done');
      break;
    case 'rclone':
      const rclone = `/usr/bin/rclone --config "${param.rcloneConf}" copy "${param.source}" "${param.destService}:${param.destDir}"`;
      console.log(`rclone command: ${rclone}`);
      execSync(rclone);
      console.log('rclone done');
      break;
    }
  }catch(e){
    console.error(e.stderr.toString());
  }
  once || setTimeout(()=>syncLog(param), param.intervalHours * 60 * 60 * 1000 - (Date.now() - timePoint));
}
config && config.sort((a,b)=>a.type=='rsync'?-1:1).forEach(syncLog);

