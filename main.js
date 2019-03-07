'use strict';

const noble = require('noble');
const Omron2jceBu01 = require('./lib/2jcie-bu01-adv-parser.js');
const config = require('./config.js');
const ambient = require('ambient-lib');


const bu01 = new Omron2jceBu01();

// ambient.connect([YOUR AMBIENT CHANNEL], "[YOUR AMBIENT WRITE ID]");
ambient.connect(config.AMBIENT_CHANNEL, config.AMBIENT_WRITE_ID);

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
    const ambData = {
      d1: envData.temperature,
      d2: envData.relativeHumidity,
      d3: envData.barometricPressure,
      d4: envData.ambientLight,
      d5: envData.soundNoise,
      d6: envData.eTVOC,
      d7: envData.eCO2,
    };
    ambient.send(ambData, (err, res, body)=> {
      if (err) { console.log(err); }
      console.log("Ambient:", res.statusCode);
    });
  }
}

//BLE scan start
const scanStart = () => {
  console.log('Scan Start!');
  setInterval(() => { noble.startScanning(); }, config.INTERVAL_MILLISEC);
  noble.on('discover', discovered);
}

if(noble.state === 'poweredOn'){
  scanStart();
}else{
  noble.on('stateChange', scanStart);
}
