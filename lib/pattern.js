// @ts-check
'use strict';

// for error recovery and handling in this 'pattern' level.
const ErrorRecord = require('./errorRecord.js');
const errorRecord = new ErrorRecord();

/**
 * @param {number} msec
 */
function sleep(msec){
  return new Promise((resolve, reject)=>{
    setTimeout(()=>resolve(true), msec);
  });
}

/**
 * @param {{sensor: any, records: any[], loopInterval: number}} param
 */
async function sensorRecords(param){
  if(param.sensor){
    console.log('sensorRecords pattern start!');
    while(true){
      let start = Date.now();
      try{
	// sensor read //
	let data = await param.sensor.read();
	data.timestamp = new Date().getTime(); 	// add timestamp to data //
	console.log(JSON.stringify(data));
	// records write //
	await Promise.all(param.records.map((r)=>r.write(data).catch(errorRecord.write)));
      }catch(e){
	errorRecord.write(e);
      }
      // sleep half of loopInterval at least, because don't record twice at once.
      let diff = Math.max((param.loopInterval + start) - Date.now(), param.loopInterval/2);
      console.log(Math.floor(diff/1000) + ' sec sleep...');
      await sleep(diff);
    }
  }else{
    errorRecord.write(new Error('sensorRecords pattern could not start, (require a sensor object in param).'));
  };
}

module.exports.sensorRecords = sensorRecords;
