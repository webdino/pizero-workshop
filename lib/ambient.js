// @ts-check
'use strict';
/*
 * Author: TAKASHI NISHIO
 * Created: 2019.8.11
 */

//const ambient = require('ambient-lib');
const Record =  require('./record.js');

module.exports = class Ambient extends Record{
  /**
   * @param {{
   *   channelId: string,
   *   writeKey: string,
   *   readKey: string,
   *   userId: string,
   *   batchQuantity: (number | undefined | null),
   *   format: function(any[]): any
   * }} param
   */
  constructor(param){
    super();
    if(!(param.channelId && param.writeKey)) throw('Ambient constructor needs channelId and writeKey.');
    this.ambient = ambientConnect();
    this.ambient.connect(param.channelId, param.writeKey, param.readKey, param.userId);
    this.channelId = param.channelId;
    this.stock = [];
    this.batchQuantity = param.batchQuantity ? Math.max(param.batchQuantity, 1) : 1
    this.format = param.format;
    this.writeCount = 0;
  }
  write(data){
    this.stock.push(data);
    this.writeCount++;
    if(this.writeCount == 1 || this.writeCount % this.batchQuantity == 0){
      console.log('Ambient: Send ' + this.stock.length.toString() + ' stocked data for ambientChannelId: ' + this.channelId + ' ...');
      return new Promise((resolve, reject) => {
	this.ambient.send(this.format(this.stock), (err, res, body)=>{
	  console.log('Ambient: Succeeded the sending, ambientChannelId: ' + this.channelId);
	  this.stock = [];
	  err && (console.error(err), process.exit(1));
	  resolve(true);
	});
      });
    }else{
      console.log('Ambient: ' + this.stock.length.toString() + ' data stocked for ambinetChannelId: ' + this.channelId);
      return true;
    }
  }
}

// modify from ambient-lib
function ambientConnect(){
  var request = require('request');
  var hostname = 'http://54.65.206.59';
  var hostname_dev = 'http://192.168.33.10';
  var channel = {
    channelId: null,
    writeKey: null,
    readKey: null,
    userKey: null,
    dev: false
  };
  return {
    connect: function(values) {
      channel.channelId = arguments[0];
      channel.writeKey = arguments[1];
      channel.readKey = arguments[2];
      channel.userKey = arguments[3];
      if ((typeof arguments[4] !== 'undefined') && arguments[4] == 1) {
        channel.dev = true;
      }
      return (typeof channel.channelId !== 'undefined');
    }
    ,
    send: function(data, cb) {
      var d = (data instanceof Array) ? data : [data];
      let options = {
        url: ((channel.dev) ? hostname_dev : hostname) + '/api/v2/channels/' + channel.channelId + '/dataarray',
        headers: {'Content-Type': 'application/json'},
        body: {writeKey: channel.writeKey, data: d},
        json: true
      };
      request.post(options, function(err, res, body) {
        if (typeof cb == 'function') {
          cb(err, res, body);
        }
      })
    }
  }
}
