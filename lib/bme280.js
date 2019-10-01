'use strict';
/*
 * Author: TAKASHI NISHIO
 * Created: 2019.8.11
 */

const Bme280_sensor = require('bme280-sensor');
const Sensor = require('./sensor.js');

module.exports = class Bme280 extends Sensor {
  constructor(param){
    super();
    const bme280 = new Bme280_sensor(options);
    const options = {
      i2cBusNo   : 1, // defaults to 1
      i2cAddress : BME280.BME280_DEFAULT_I2C_ADDRESS() // defaults to 0x77
    };
    bme280.init()
      .then(() => {
	console.log('BME280 initialization succeeded');
	readSensorData();
      })
      .catch((err) => console.error(`BME280 initialization failed: ${err} `));
  }
  read(){
    return new Promise((resolve,reject)=>{
      bme280.readSensorData()
	.then((data) => {
	  // temperature_C, pressure_hPa, and humidity are returned by default.
	  // I'll also calculate some unit conversions for display purposes.
	  //
	  data.temperature_F = BME280.convertCelciusToFahrenheit(data.temperature_C);
	  data.pressure_inHg = BME280.convertHectopascalToInchesOfMercury(data.pressure_hPa);
	  console.log(`data = ${JSON.stringify(data, null, 2)}`);
	  resolve(data);
	})
	.catch((err) => {
	  console.error(`BME280 read error: ${err}`);
	  reject(err);
	});
    });
  }
}


// data = {
//   "temperature_C": 32.09,
//   "humidity": 34.851083883116694,
//   "pressure_hPa": 1010.918480644477,
//   "temperature_F": 89.76200000000001,
//   "pressure_inHg": 29.852410107059583
// }


const BME280 = require('bme280-sensor');

// The BME280 constructor options are optional.
// 
const options = {
  i2cBusNo   : 1, // defaults to 1
  i2cAddress : BME280.BME280_DEFAULT_I2C_ADDRESS() // defaults to 0x77
};

const bme280 = new BME280(options);

// Read BME280 sensor data, repeat
//
const readSensorData = () => {
  bme280.readSensorData()
    .then((data) => {
      // temperature_C, pressure_hPa, and humidity are returned by default.
      // I'll also calculate some unit conversions for display purposes.
      //
      data.temperature_F = BME280.convertCelciusToFahrenheit(data.temperature_C);
      data.pressure_inHg = BME280.convertHectopascalToInchesOfMercury(data.pressure_hPa);
 
      console.log(`data = ${JSON.stringify(data, null, 2)}`);
      setTimeout(readSensorData, 2000);
    })
    .catch((err) => {
      console.log(`BME280 read error: ${err}`);
      setTimeout(readSensorData, 2000);
    });
};

// Initialize the BME280 sensor
//

bme280.init()
  .then(() => {
    console.log('BME280 initialization succeeded');
    readSensorData();
  })
  .catch((err) => console.error(`BME280 initialization failed: ${err} `));
