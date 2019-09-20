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
      let data = sensor && await param.sensor.read();
      data.timestamp = new Date().getTime();
      console.log(JSON.stringify(data));
      await Promise.all(param.records.map((r)=>r.write(data)));
    }catch(e){
      console.error(e);
    }
    let diff = (param.loopInterval + start) - Date.now();
    console.log(Math.floor(diff/1000) + ' sec sleep...');
    await sleep(diff > 0 ? diff : 0);
  }
}

module.exports.sensor_records = sensorRecords;
