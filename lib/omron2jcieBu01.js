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
    //BLE scan start
    if(noble.state === 'poweredOn'){
      scanStart();
    }else{
      noble.on('stateChange', scanStart);
    }
  }
  scanStart(){
    console.log('Scan Start!');
    noble.startScanning();//loop start
    noble.on('discover', discovered);
  }
  discovered(peripheral){
    const device = {
      name: peripheral.advertisement.localName,
      uuid: peripheral.uuid,
      rssi: peripheral.rssi
    };
    const d = new Date();
    if(this.name === device.name && this.address.toLowerCase() === device.uuid) {
      const envData = this.bu01.parse(peripheral.advertisement.manufacturerData.toString('hex'));
      //console.log(JSON.stringify(envData));
      if(Object.values(envData).every(value=>value!=0)){//check zero value
	let rr = this.queue.shift();
	rr && rr[0](envData);//resolve
      }
      noble.startScanning();//loop continue
    }
  }
  read(){
    return new Promise((resolve, reject) => {
      this.queue.push([resolve,reject]);
    });
  }
}
