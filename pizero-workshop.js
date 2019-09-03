'use strict';
/*
 * Author: TAKASHI NISHIO
 * Created: 2019.8.11
 * Last updated: 2019.8.28
 */

require('date-utils');

const fs = require('fs');
function isExistFile(file) {
  try {
    fs.statSync(file);
    return true
  } catch(err) {
    if(err.code === 'ENOENT') return false
  }
}
const config_file = isExistFile('/boot/setting/config.js') ? '/boot/setting/config.js' : './config.js';
console.log('config_file: "' + config_file + '"');
const config = require(config_file);

const csv = {
  src: 'CSV.js',
  //path: '/home/pi/bird/log/Omron2jcieBu01.csv',
  path: '/home/pi/pizero-workshop/log/Omron2jcieBu01.csv',
  date: true,
  date_format: 'YYYY-MM-DD HH24:MI:SS',
  order: ['temperature', 'relativeHumidity', 'barometricPressure', 'ambientLight','soundNoise', 'eTVOC', 'eCO2']
};

let machinist = {
  src: 'MACHINIST.js',
  api_key: config.MACHINIST_API_KEY,
  multiple: config.MACHINIST_MULTIPLE,
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
    return {agent: "playground",
	    metrics: metrics};}
};

const ambient = {
  src: 'AMBIENT.js',
  channel_id: config.AMBIENT_CHANNEL,
  write_key: config.AMBIENT_WRITE_KEY,
  read_key: config.AMBIENT_READ_KEY,
  user_id: config.AMBIENT_USER_ID,
  multiple: config.AMBIENT_MULTIPLE,
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
};

const record_modules = {'CSV': csv, 'MACHINIST': machinist, 'AMBIENT': ambient};
const param = {
  sensor: {src: 'OMRON_2JCIE_BU01.js', name: config.NAME, address: config.ADDRESS},
  records: config.RECORDS.map((name)=>record_modules[name]),
  loop_interval: config.INTERVAL_MILLISEC,
  error_file: '/home/pi/pizero-workshop/log/error.txt'
  //error_file: '/home/pi/bird/log/error.txt'
}

let main_loop = require('PATTERN1.js');
main_loop(param);

