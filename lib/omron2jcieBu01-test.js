// @ts-check
'use strict';

const noble = require('noble');
const OmronEnv = require('./2jcie-bu01-adv-parser.js');

const NAME = 'Rbt';
// const ADDRESS = '[YOUR BU01 ADDRESS NO SEMICOLON]';

const INTERVAL_MILLISEC = 5000;

const bu01 = new OmronEnv();

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

//BLE scan start, and forever call callback when discover. //
// Attension, this program don't call noble.stopScannig(), //
//   It might be good to call noble.stopScannig() when don't use discoverd. //
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

