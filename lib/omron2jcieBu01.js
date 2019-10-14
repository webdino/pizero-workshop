// @ts-check
'use strict';

const noble = require('noble');
const bu01Parser = require('./2jcie-bu01-adv-parser.js');
const Sensor = require('./sensor.js');

// Using scanStop(), process cpu usage is 0% (on 'top' command) by this program, //
//    but don't using scanStop(), always 14%~20% process cpu usage.//
let numberOfListener = 0;
const scanStart = ()=>{
  console.log('Scan Start!');
  noble.startScanning([],true);
}
function listen(){
  if(numberOfListener === 0){
    if(noble.state === 'poweredOn') scanStart();
    else noble.on('stateChange', scanStart);
  }
  numberOfListener++;
}
function stopListen(){
  if(--numberOfListener === 0){
    console.log('Scan Stop!');
    noble.stopScanning();
  }
}

module.exports = class Omron2jcieBu01 extends Sensor {
   /**
   * @param {{name: string, address: string}} param
   */
  constructor(param){
    super();
    this.queue = new Array();
    this.bu01 = new bu01Parser();
    this.name = param.name;
    // valid address is like 'A1:B2:C3:D4:E5:F6' or '123456ABCDEF' or 'abcDEF123456' or ... //
    if(!(param.address.match(/^[A-Za-z0-9][A-Za-z0-9][A-Za-z0-9][A-Za-z0-9][A-Za-z0-9][A-Za-z0-9]$/) ||
	 param.address.match(/^[A-Za-z0-9][A-Za-z0-9]\:?[A-Za-z0-9][A-Za-z0-9]\:?[A-Za-z0-9][A-Za-z0-9]\:?[A-Za-z0-9][A-Za-z0-9]\:?[A-Za-z0-9][A-Za-z0-9]\:?[A-Za-z0-9][A-Za-z0-9]$/))){
      throw new Error('Address in param is invalid string as OMRON 2JCIE-BU01 bluetooth adress format.');
    }
    // Attention to 'toLowerCase()', not 'toUpperCase()' //
    this.address = param.address.toLowerCase().replace(/\:/g,'');

    // set this to self, because 'this' of noble.on discover callback is not called as method of this Omron2jcie class object. //
    const self = this;
    noble.on('discover', function(peripheral){
      const device = {
	name: peripheral.advertisement.localName,
	uuid: peripheral.uuid,
	rssi: peripheral.rssi
      };
      if(self.queue.length != 0 && self.name === device.name && self.address === device.uuid) {
	const envData = self.bu01.parse(peripheral.advertisement.manufacturerData.toString('hex'));
	// omron2jce send 7 values as zero immidiately after powerd on //
	if(!["temperature","relativeHumidity","ambientLight","barometricPressure","soundNoise","eTVOC","eCO2"].every(key=>envData[key] === 0)){
	  console.log(JSON.stringify(envData));
	  // dequeue resolve function and call //
	  self.queue.shift()[0](envData);
	  // might call scanStop //
	  stopListen(); 	  
	}
      }
    });
  }

  /**
   * @returns {Promise<Object>}
   */
  read(){
    return new Promise((resolve, reject) => {
      // might call scanStart //
      listen();
      // enqueue resolve function //
      this.queue.push([resolve,reject]);
    });
  }
}
