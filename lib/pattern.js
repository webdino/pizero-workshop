'use strict';

function sleep(msec){
  return new Promise((resolve, reject)=>{
    setTimeout(()=>resolve(true), msec);
  });
}

//module.exports = function(param){
async function sensorRecords(param){
  while(true){
    let start = Date.now();
    try{
      let data = param.sensor && await param.sensor.read();
      data.timestamp = new Date().getTime();
      console.log(JSON.stringify(data));
      await Promise.all(param.records.map((r)=>r.write(data)));
    }catch(e){
      console.error(e);
    }
    let diff = Math.max((param.loopInterval + start) - Date.now(), param.loopInterval/2);
    console.log(Math.floor(diff/1000) + ' sec sleep...');
    await sleep(diff);
  }
}

module.exports.sensorRecords = sensorRecords;
