'use strict';
/*
 * Author: TAKASHI NISHIO
 * Created: 2019.8.11
 */

const noble = require('noble');
const OmronEnv = require('./lib/2jcie-bu01-adv-parser.js');

const NAME = 'Rbt';
// const ADDRESS = '[YOUR BU01 ADDRESS NO SEMICOLON]';
//const ADDRESS = 'FB29A990F24B';
const ADDRESS = 'D6CFA06A4BF7';
const INTERVAL_MILLISEC = 5000;

const bu01 = new OmronEnv();

//discovered BLE device
const discovered = (peripheral) => {
  const device = {
    name: peripheral.advertisement.localName,
    uuid: peripheral.uuid,
    rssi: peripheral.rssi
  };
  const d = new Date();
  if(NAME === device.name && ADDRESS.toLowerCase() === device.uuid) {
    const envData = bu01.parse(peripheral.advertisement.manufacturerData.toString('hex'));
    console.log(JSON.stringify(envData));
  }
}

//BLE scan start
const scanStart = () => {
  console.log('Scan Start!');
  setInterval(() => { noble.startScanning(); }, INTERVAL_MILLISEC);
  noble.on('discover', discovered);
}

if(noble.state === 'poweredOn'){
  scanStart();
}else{
  noble.on('stateChange', scanStart);
}

