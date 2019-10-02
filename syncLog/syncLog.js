'use strict';

//const once = process.argv[3] == '-execStop'

const execSync = require('child_process').execSync;
let config = require(process.argv[2]);
let hourCount = 0;

if(!config){
  console.log('Config parameter is nothing, finished.')
}else{
  function loop(){
    const startTime = Date.now();
    config.sort((a,b)=>a.type==='rsync'?-1:1).forEach((param)=>{
      try{
	if(hourCount % param.intervalHours === 0){
	  switch(param.type){
	  case 'rsync':
	    hourCount===0 && console.log('rsync start!');
	    execSync(`/usr/bin/rsync -rlpt "${param.source}" "${param.dest}"`);
	    hourCount===0 && console.log('rsync ok!');
	    break;
	  case 'rclone':
	    hourCount===0 && console.log('rclone start!');
	    execSync(`/usr/bin/rclone --config "${param.rcloneConf}" copy "${param.source}" "${param.destService}:${param.destDir}"`);
	    hourCount===0 && console.log('rclone ok!');
	    break;
	  }
	}
      }catch(e){
	console.error(e);
      }
    });
    hourCount++;
    const sleepMillisec = Math.max(0, 60 * 60 * 1000 - (Date.now() - startTime));
    //console.log(Math.floor(sleepMillisec/1000) + ' sec sleep ... ');
    //once || setTimeout(loop, sleepMillisec);
    setTimeout(loop, sleepMillisec);
  }
  loop();
}

