// @ts-check
'use strict';

require('date-utils');
const Omron2jcieBu01 = require('omron2jcieBu01.js');
const Csv = require('csv.js');
const Machinist = require('machinist.js');
const Ambient = require('ambient.js');
const localServer = require("pizero-workshop-http");
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
const configFile = isExistFile('/boot/setting/config.js') ? '/boot/setting/config.js' : './setting/config.js';
console.log('config_file: "' + configFile + '"');

/**
 * @typedef {{csvFilename: string}} CsvConfig
 * @typedef {{
 *   machinistApiKey: string,
 *   machinistAgent: string,
 *   machinistBatchQuantity: number
 * }} MachinistConfig
 * @typedef {{
 *   ambientChannelId: string,
 *   ambientUserId: string,
 *   ambientWriteKey: string,
 *   ambientReadKey: string,
 *   ambientBatchQuantity: number
 * }} AmbientConfig
 * @typedef {{server: boolean}} ServerConfig
 * @type {Array<
 *   {
 *     intervalMillisec: number,
 *     omron2jcieBu01Name: string,
 *     omron2jcieBu01Address: string
 *   } & Partial<CsvConfig>
 *     & Partial<MachinistConfig>
 *     & Partial<AmbientConfig>
 *     & Partial<ServerConfig>
 * >}
 */
const config = require(configFile);

config && config.forEach((param)=>{
  const omron2jcieBu01 = param.omron2jcieBu01Name && param.omron2jcieBu01Address && new Omron2jcieBu01({
    name: param.omron2jcieBu01Name,
    address: param.omron2jcieBu01Address});
  const csv = param.csvFilename &&
	new Csv({
	  path: `${logDirectory}/${param.csvFilename}`,
	  date: true,
	  dateFormat: 'YYYY-MM-DD HH24:MI:SS',
	  order: ['temperature', 'relativeHumidity', 'barometricPressure', 'ambientLight','soundNoise', 'eTVOC', 'eCO2']
	});
  const machinist = (param.machinistApiKey && param.machinistAgent && param.machinistBatchQuantity)
	&& new Machinist({
	  agent: param.machinistAgent,
	  apiKey: param.machinistApiKey,
	  batchQuantity: param.machinistBatchQuantity,
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
  const ambient = (param.ambientChannelId && param.ambientWriteKey)
	&& new Ambient({
	  channelId: param.ambientChannelId,
	  writeKey: param.ambientWriteKey,
	  readKey: param.ambientReadKey,
	  userId: param.ambientUserId,
	  batchQuantity: param.ambientBatchQuantity,
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
	const server = param.server && localServer();
  if(omron2jcieBu01 && (csv || machinist || ambient)){
    console.log('sensorRecords pattern start with: ' + (omron2jcieBu01 ? 'omron2jcieBu01 ' : ' ') + (csv ? 'csv ' : ' ') + (machinist ? 'machinist ' : ' ') + (ambient ? 'ambient ' : ' '));
    // call pattern function //
    pattern.sensorRecords({
      loopInterval: param.intervalMillisec,
      sensor: omron2jcieBu01,
      records: [server, csv, machinist, ambient].filter(record=>record)
    });
  }else{
    console.log('sensorRecords pattern coud not start with this uncomplete setting.');
  };
});

console.log('All sensorRecords pattern starter is finished, and wait loop start!');
(function waitLoop(){
  setTimeout(waitLoop, 1000);
})();
