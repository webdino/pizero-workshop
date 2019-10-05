// @ts-check
'use strict';

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
	let data = await param.sensor.read();
	data.timestamp = new Date().getTime();
	console.log(JSON.stringify(data));
	await Promise.all(param.records.map((r)=>r.write(data)));
      }catch(e){
	errorRecord.write(e);//errorWrite(e);//console.error(e);
      }
      let diff = Math.max((param.loopInterval + start) - Date.now(), param.loopInterval/2);
      console.log(Math.floor(diff/1000) + ' sec sleep...');
      await sleep(diff);
    }
  }else{
    errorRecord.write(new Error('sensorRecords pattern could not start, (require a sensor object in param).'));
    //errorWrite(new Error('sensorRecords pattern could not start, (require a sensor object in param).'));
    //console.error('sensorRecords pattern could not start, (require a sensor object in param).');
  };
}

module.exports.sensorRecords = sensorRecords;
