'use strict';

const noble = require('noble');
const OmronEnv = require('./lib/2jcie-bu01-adv-parser.js');
const config = require('./config.js');

// const ADDRESS = '[YOUR BU01 ADDRESS NO SEMICOLON]';

const bu01 = new OmronEnv();

//discovered BLE device
const discovered = (peripheral) => {
  const device = {
    name: peripheral.advertisement.localName,
    uuid: peripheral.uuid,
    rssi: peripheral.rssi
  };
  const d = new Date();
  if(config.NAME === device.name && config.ADDRESS.toLowerCase() === device.uuid) {
    const envData = bu01.parse(peripheral.advertisement.manufacturerData.toString('hex'));
    console.log(JSON.stringify(envData));
  }
}

//BLE scan start
const scanStart = () => {
  console.log('Test Start!');
  setInterval(() => { noble.startScanning(); }, config.INTERVAL_MILLISEC);
  noble.on('discover', discovered);
}

if(noble.state === 'poweredOn'){
  scanStart();
}else{
  noble.on('stateChange', scanStart);
}

