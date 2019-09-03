'use strict';
/*
 * Author: TAKASHI NISHIO
 * Created: 2019.8.11
 * Last updated: 2019.8.28
 */
const fs = require('fs');

function sleep(msec){
    return new Promise((resolve, reject)=>{
	setTimeout(()=>resolve(true), msec);
    });
}

module.exports = function(param){
    console.log(param.records);
    const sensor = param.sensor && require(param.sensor.src)(param.sensor);
    const records = param.records.map((param)=>require(param.src)(param));
    (async function(){
	while(true){
	    let start = Date.now();
	    try{
		let data = sensor && await sensor.read();
		data.timestamp = new Date().getTime();
		console.log(JSON.stringify(data));

		await Promise.all(records.map((r)=>r.record(data)));
	    }catch(e){
		console.error(e);
		if(param.error_file){
		    try {
			fs.writeFileSync(param.error_file, e, 'utf-8');
		    }catch(e){
			console.error(e);
		    }
		}
	    }
	    let diff = (param.loop_interval + start) - Date.now();
	    console.log(Math.floor(diff/1000)+' sec sleep...');
	    await sleep(diff > 0 ? diff : 0);
	}
    })();
}
