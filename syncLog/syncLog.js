'use strict';

// This program is call by start.sh as last main execution //

//const once = process.argv[3] == '-execStop'

const execSync = require('child_process').execSync;
let config = require(process.argv[2]);
let hourCount = 0;
const rclonePingWaitSec = 180;// for waiting internet connect establish before rclone //

if(!config || config.length === 0){
  console.log('Config parameter is nothing, finished.')
}else{
  function loop(){
    const startTime = Date.now();
    config.sort((a,b)=>a.type==='rsync'?-1:1).forEach((param)=>{ // sort, because rsync before rclone. //
      try{
	if(hourCount % param.intervalHours === 0){
	  switch(param.type){
	  case 'rsync':
	    hourCount===0 && console.log('First time rsync start!');
	    execSync(`/usr/bin/rsync -rlpt "${param.source}" "${param.dest}"`);
	    hourCount===0 && console.log('First time rsync is done!');
	    break;
	  case 'rclone':
	    hourCount===0 && console.log('First time rclone is start!');
	    // Before rclone, have to do checking and waiting that inernet connection is established. //
	    //   (Especialy when os start up, for waiting wifi configuration update and establish re-connection is done.) //
	    execSync(`
if ! (ping -c 1 webdino.org > /dev/null 2>&1;) then sleep ${rclonePingWaitSec}; fi
if ping -c 1 webdino.org > /dev/null 2>&1; then
   /usr/bin/rclone --config "${param.rcloneConf}" copy "${param.source}" "${param.destService}:${param.destDir}"
  exit 0
fi
exit 1
`);
	    hourCount===0 && console.log('First time rclone is done!');
	    break;
	  }
	}
      }catch(e){
	console.error(new Date());
	console.error(e.toString());
      }
    });
    console.log('rsync and rclone wait loop is started successfully!');
    hourCount++;
    const sleepMillisec = Math.max(0, 60 * 60 * 1000 - (Date.now() - startTime));
    setTimeout(loop, sleepMillisec); //once || setTimeout(loop, sleepMillisec);
  }
  loop();
}

