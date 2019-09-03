'use strict';
/*
 * Author: TAKASHI NISHIO
 * Created: 2019.8.11
 */

const noble = require('noble');
const Omron2jceBu01 = require('./2jcie-bu01-adv-parser.js');

const queue = new Array();

module.exports = function (param){
    const bu01 = new Omron2jceBu01();
    const discovered = (peripheral) => {
	const device = {
	    name: peripheral.advertisement.localName,
	    uuid: peripheral.uuid,
	    rssi: peripheral.rssi
	};
	const d = new Date();
	if(param.name === device.name && param.address.toLowerCase() === device.uuid) {
	    const envData = bu01.parse(peripheral.advertisement.manufacturerData.toString('hex'));
	    //console.log(JSON.stringify(envData));
	    let rr = queue.shift();
	    rr && rr[0](envData);//resolve
	    noble.startScanning();//loop continue
	}
    }
    //BLE scan start
    const scanStart = () => {
	console.log('Scan Start!');
	noble.startScanning();//loop start
	noble.on('discover', discovered);
    }
    if(noble.state === 'poweredOn'){
	scanStart();
    }else{
	noble.on('stateChange', scanStart);
    }
    
    return {
	read: ()=>{
	    return new Promise((resolve, reject) => {
		queue.push([resolve,reject]);
	    });
	}
    };
}
