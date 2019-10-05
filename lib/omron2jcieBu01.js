// @ts-check
'use strict';

const noble = require('noble');
const bu01Parser = require('./2jcie-bu01-adv-parser.js');
const Sensor = require('./sensor.js');

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
    this.address = param.address;
    const self = this;
    noble.on('discover', function(peripheral){
      const device = {
	name: peripheral.advertisement.localName,
	uuid: peripheral.uuid,
	rssi: peripheral.rssi
      };
      if(self.queue.length != 0 &&
	 self.name === device.name && self.address.toLowerCase() === device.uuid) {
	const envData = self.bu01.parse(peripheral.advertisement.manufacturerData.toString('hex'));
	if(!Object.values(envData).every(value=>value == 0)){
	  console.log(JSON.stringify(envData));
	  self.queue.shift()[0](envData);//resolve
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
      listen();
      this.queue.push([resolve,reject]);
    });
  }
}
