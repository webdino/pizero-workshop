'use strict';
/*
 * Author: TAKASHI NISHIO
 * Created: 2019.8.11
 */

const noble = require('noble');
const bu01Parser = require('./2jcie-bu01-adv-parser.js');
const Sensor = require('./sensor.js');

module.exports = class Omron2jcieBu01 extends Sensor {
  constructor(param){
    super();
    this.queue = new Array();
    this.bu01 = new bu01Parser();
    this.name = param.name;
    this.address = param.address;
    const self = this;
    self.discovered = function(peripheral){
      const device = {
	name: peripheral.advertisement.localName,
	uuid: peripheral.uuid,
	rssi: peripheral.rssi
      };
      if(self.name === device.name && self.address.toLowerCase() === device.uuid) {
	const envData = self.bu01.parse(peripheral.advertisement.manufacturerData.toString('hex'));
	let rr;
	if(Object.values(envData).every(value=>value != 0) && (rr = self.queue.shift())){
	  console.log(JSON.stringify(envData));
	  rr[0](envData);//resolve
	  noble.stopScanning();
	}else{
	  noble.startScanning();//loop continue
	}
      }
    }
    self.scanStart = function(){
      console.log('Scan Start!');
      noble.startScanning();//loop start
      noble.on('discover', self.discovered);
    }
  }
  read(){
    //BLE scan start
    if(noble.state === 'poweredOn'){
      this.scanStart();
    }else{
      noble.on('stateChange', this.scanStart);
    }
    return new Promise((resolve, reject) => {
      this.queue.push([resolve,reject]);
    });
  }
}
