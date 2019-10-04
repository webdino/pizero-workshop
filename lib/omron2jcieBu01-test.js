// @ts-check
'use strict';
/*
 * Author: TAKASHI NISHIO
 * Created: 2019.8.11
 */

const noble = require('noble');
const OmronEnv = require('./2jcie-bu01-adv-parser.js');

const NAME = 'Rbt';
// const ADDRESS = '[YOUR BU01 ADDRESS NO SEMICOLON]';

const INTERVAL_MILLISEC = 5000;

const bu01 = new OmronEnv();

//discovered BLE device
let timePoint = Date.now() - INTERVAL_MILLISEC;

/**
 * @param {{advertisement: any, uuid: string, rssi: string}} peripheral
 */
function discovered(peripheral){
  const device = {
    name: peripheral.advertisement.localName,
    uuid: peripheral.uuid,
    rssi: peripheral.rssi
  };
  if(NAME === device.name
     && ADDRESS.toLowerCase() === device.uuid
     && (Date.now() - timePoint) > INTERVAL_MILLISEC) {
      timePoint = Date.now();
      const envData = bu01.parse(peripheral.advertisement.manufacturerData.toString('hex'));
      console.log(JSON.stringify(envData));
  }
}

//BLE scan start
function scanStart(){
  console.log('Scan Start!');
  noble.startScanning([], true);
  noble.on('discover', discovered);
}
if(noble.state === 'poweredOn'){
  scanStart();
}else{
  noble.on('stateChange', scanStart);
}

