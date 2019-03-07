/*
 * OMRON ENV Sensor 2JCIE-BU01 ADV Data Parser
 *
 * Author: Bathtimefish
 * Created: 2019.1.6
 */

function Omron2jceBu01() {
  /* pass */
};

Omron2jceBu01.prototype._litlleEndialize8byte = function(v) {
  if(v.length !== 8) {
    throw new Error('invalid data length. data length must 8');
  }
  return v.substring(6,8) + v.substring(4,6) + v.substring(2,4) + v.substring(0,2);
};

Omron2jceBu01.prototype._litlleEndialize4byte = function(v) {
  if(v.length !== 4) {
    throw new Error('invalid data length. data length must 4');
  }
  return v.substring(2,4) + v.substring(0,2);
};

Omron2jceBu01.prototype._numberize8byte = function(v) {
  //console.info(v);
  if(v.length !== 8) {
    throw new Error('invalid data length. data length must 8');
  }
  return parseInt(this._litlleEndialize8byte(v), 16);
};

Omron2jceBu01.prototype._numberize4byte = function(v) {
  //console.info(v);
  if(v.length !== 4) {
    throw new Error('invalid data length. data length must 4');
  }
  return parseInt(this._litlleEndialize4byte(v), 16); // / 100
};

Omron2jceBu01.prototype._numberizeSigned4byte = function(v) {
  //console.info(v);
  if(v.length !== 4) {
    throw new Error('invalid data length. data length must 4');
  }
 let a = parseInt(this._litlleEndialize4byte(v), 16);
 if ((a & 0x8000) > 0) {
    a = a - 0x10000;
 }
 return a;
};

Omron2jceBu01.prototype._numberize2byte = function(v) {
  //console.info(v);
  if(v.length !== 2) {
    throw new Error('invalid data length. data length must 2');
  }
  return parseInt(v, 16);
};

Omron2jceBu01.prototype._getDataType = function(v) {
    return this._numberize2byte(v.substring(4, 6));
};

Omron2jceBu01.prototype._parseDataType1 = function(v) {
  var data = {
    "companyId": this._numberize4byte(v.substring(0, 4)),
    "dataType": this._numberize2byte(v.substring(4, 6)),
    "sequenceNo": this._numberize2byte(v.substring(6, 8)),
    "temperature": this._numberize4byte(v.substring(8, 12)) / 100,
    "relativeHumidity": this._numberize4byte(v.substring(12, 16)) / 100,
    "ambientLight": this._numberize4byte(v.substring(16, 20)),
    "barometricPressure": this._numberize8byte(v.substring(20, 28)) / 1000,
    "soundNoise": this._numberize4byte(v.substring(28, 32)) / 100,
    "eTVOC": this._numberize4byte(v.substring(32, 36)),
    "eCO2": this._numberize4byte(v.substring(36, 40)),
    "reserveForFutureUse": this._numberize2byte(v.substring(40, 42)) 
  };
  return data;
};

Omron2jceBu01.prototype._parseDataType2 = function(v) {
  var data = {
    "companyId": this._numberize4byte(v.substring(0, 4)),
    "dataType": this._numberize2byte(v.substring(4, 6)),
    "sequenceNo": this._numberize2byte(v.substring(6, 8)),
    "discomfortIndex": this._numberize4byte(v.substring(8, 12)) / 100,        // 不快指数
    "heatStroke": this._numberize4byte(v.substring(12, 16)) / 100,            // 熱中症指数
    "vibrationInformation": this._numberize2byte(v.substring(16, 18)),        // 振動情報(0:振動なし,1:振動中,2:地震)
    "siValue": this._numberize4byte(v.substring(18, 22)) / 10,                // SI値 振動が構造物に与える影響指数
    "pga": this._numberize4byte(v.substring(22, 26)) / 10,                    // 水平最大加速度
    "seismicIntensity": this._numberize4byte(v.substring(26, 30)) / 1000,     // SI値から求めた震度相関値
    "accelerationX": (this._numberizeSigned4byte(v.substring(30, 34)) / 10),  // X軸加速度
    "accelerationY": (this._numberizeSigned4byte(v.substring(34, 38)) / 10),  // Y軸加速度
    "accelerationZ": (this._numberizeSigned4byte(v.substring(38, 42)) / 10),  // Z軸加速度
  };
  return data;
};

Omron2jceBu01.prototype.parse = function(v) {
  const packet = v || null;
  if(!packet) throw new Error('data is empty');
  if(packet.length !== 42) throw new Error('invalid data length. packet data length must 42');
  const dataType = this._getDataType(packet);
  switch(dataType) {
    case 1:
      return parsedData = this._parseDataType1(packet);
    case 2:
      return parsedData = this._parseDataType2(packet);
    default:
      throw new Error('invalud data type');
  }
};

module.exports = Omron2jceBu01;
