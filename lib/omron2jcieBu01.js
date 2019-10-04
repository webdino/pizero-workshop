// @ts-check
'use strict';
/*
 * Author: TAKASHI NISHIO
 * Created: 2019.8.11
 */

const noble = require('noble');
const bu01Parser = require('./2jcie-bu01-adv-parser.js');
const Sensor = require('./sensor.js');

let numberOfListener = 0;
function listen(){
  const scanStart = ()=>{
    console.log('Scan Start!');
    noble.startScanning([],true);
  }
  if(numberOfListener == 0){
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
      //console.log(device.name);
      if(self.queue.length != 0 &&
	 self.name === device.name && self.address.toLowerCase() === device.uuid) {
	const envData = self.bu01.parse(peripheral.advertisement.manufacturerData.toString('hex'));
	if(Object.values(envData).every(value=>value != 0)){
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


// const noble = require('noble');
// const bu01Parser = require('./2jcie-bu01-adv-parser.js');
// const Sensor = require('./sensor.js');

// let notalready = true;

// module.exports = class Omron2jcieBu01 extends Sensor {
//   constructor(param){
//     super();
//     this.queue = new Array();
//     this.bu01 = new bu01Parser();
//     this.name = param.name;
//     this.address = param.address;
//     const self = this;
//     self.discovered = function(peripheral){
//       const device = {
// 	name: peripheral.advertisement.localName,
// 	uuid: peripheral.uuid,
// 	rssi: peripheral.rssi
//       };
//       //console.log(peripheral.uuid);
//       if(self.queue.length != 0 &&
// 	 self.name === device.name && self.address.toLowerCase() === device.uuid) {
//       //if(self.name === device.name && self.address.toLowerCase() === device.uuid) {
// 	const envData = self.bu01.parse(peripheral.advertisement.manufacturerData.toString('hex'));
// 	let rr;
// 	if(Object.values(envData).every(value=>value != 0) && (rr = self.queue.shift())){
// 	  console.log(JSON.stringify(envData));
// 	  rr[0](envData);//resolve
// 	  //noble.stopScanning();
// 	}else{
// 	  //noble.startScanning();//loop continue
// 	}
//       }
//     }
//     self.scanStart = function(){
//       console.log('Scan Start!');
//       //noble.startScanning([],true);//loop start
//       noble.startScanning([],true);//loop start
//       noble.on('discover', self.discovered);
//     }
//   }
//   read(){
//     //BLE scan start
//     if(notalready){
//       if(noble.state === 'poweredOn'){
// 	this.scanStart();
//       }else{
// 	noble.on('stateChange', this.scanStart);
//       }
//     }
//     notalready = false;
//     return new Promise((resolve, reject) => {
//       console.log('--------------');
//       this.queue.push([resolve,reject]);
//     });
//   }
// }
