'use strict';
/*
 * Author: TAKASHI NISHIO
 * Created: 2019.8.11
 * Last updated: 2019.9.19
 */

require('date-utils');
const Omron2jcieBu01 = require('omron2jcieBu01.js');
const Machinist = require('machinist.js');
const Csv = require('csv.js');
const pattern = require('pattern.js');

const logDirectory = '/home/pi/pizero-workshop/log'

const fs = require('fs');
function isExistFile(file) {
  try {
    fs.statSync(file);
    return true
  } catch(err) {
    if(err.code === 'ENOENT') return false
  }
}
const configFile = isExistFile('/boot/setting/config.js') ? '/boot/setting/config.js' : './config.js';
console.log('config_file: "' + configFile + '"');
const config = require(configFile);

config.omron2jcieBu01_Csv_Machinist &&
config.omron2jcieBu01_Csv_Machinist.forEach((param)=>{
  const omron2jcieBu01 = new Omron2jcieBu01({
    name: param.omron2jcieBu01Name,
    address: param.omron2jcieBu01Address});
  const csv = new Csv({
    path: `${logDirectory}/${param.csvFilename}`,
    date: true,
    dateFormat: 'YYYY-MM-DD HH24:MI:SS',
    order: ['temperature', 'relativeHumidity', 'barometricPressure', 'ambientLight','soundNoise', 'eTVOC', 'eCO2']
  });
  const machinist = new Machinist({
    apikey: param.machinistApikey,
    multiple: param.machinistMultiple,
    format: (datas)=>{
      let metrics = [];
      datas.forEach((data)=>{
	let timestamp = Math.floor(data.timestamp / 1000);
	metrics.push({
	  name: "温度",
	  namespace: "2JCIE-BU",
	  data_point: {value: data.temperature, timestamp: timestamp}});
	metrics.push({
	  name: "湿度",
	  namespace: "2JCIE-BU",
	  data_point: {value: data.relativeHumidity, timestamp: timestamp}});
	metrics.push({
	  name: "大気圧",
	  namespace: "2JCIE-BU",
	  data_point: {value: data.barometricPressure, timestamp: timestamp}});
	metrics.push({
	  name: "騒音",
	  namespace: "2JCIE-BU",
	  data_point: {value: data.soundNoise, timestamp: timestamp}});
	metrics.push({
	  name: "照度",
	  namespace: "2JCIE-BU",
	  data_point: {value: data.ambientLight, timestamp: timestamp}});
	metrics.push({
	  name: "総揮発性有機化合物濃度",
	  namespace: "2JCIE-BU",
	  data_point: {value: data.eTVOC, timestamp: timestamp}});
	metrics.push({
	  name: "二酸化炭素",
	  namespace: "2JCIE-BU",
	  data_point: {value: data.eCO2, timestamp: timestamp}});});
      return {agent: param.machinistAgent,
	      metrics: metrics};}
  });
  pattern.sensorRecords({
    loopInterval: param.intervalMillisec,
    sensor: omron2jcieBu01,
    records: [csv, machinist]
  });
});

/*
const ambient = new Ambient({
  channel_id: ,
  write_key: ,
  read_key: ,
  user_id: ,
  multiple: ,
  format: (datas)=>datas.map((data)=>{
    return {
      created: new Date(data.timestamp).toFormat('YYYY-MM-DD HH24:MI:SS'),
      d1: data.temperature,
      d2: data.relativeHumidity,
      d3: data.barometricPressure,
      d4: data.ambientLight,
      d5: data.soundNoise,
      d6: data.eTVOC,
      d7: data.eCO2
    };})
});
*/
