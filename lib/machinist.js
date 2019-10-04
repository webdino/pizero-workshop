// @ts-check
'use strict';
/*
 * Author: TAKASHI NISHIO
 * Created: 2019.8.11
 */

const http = require('https');
const Record = require('./record.js');

module.exports = class Machinist extends Record{
	/**
	 * @param {{agent: string, apiKey: string, batchQuantity: number, format: function(any[]): any}} param
	 */
  constructor(param){
    if(!(param.agent && param.apiKey && param.batchQuantity && param.format)) throw new Error();
    super();
    this.stock = [];
    this.batchQuantity =  param.batchQuantity ? Math.max(param.batchQuantity, 1) : 1
    this.format = param.format;
    this.apiKey = param.apiKey;
    this.agent = param.agent;
    this.writeCount = 0;
  }
  write(data){
    this.stock.push(data);
    this.writeCount++;
    if(this.writeCount == 1 || this.writeCount % this.batchQuantity == 0){
      console.log('Machinist: Send ' + this.stock.length.toString() + ' stocked data for machinistAgent: ' + this.agent + ', machinistApiKey: ' + this.apiKey + ' ...');
      let postDataStr = JSON.stringify(this.format(this.stock));
      this.stock = [];
      console.log(postDataStr);
      let options = {
	host: 'gw.machinist.iij.jp',
	port: 443,
	path: '/endpoint',
	method: 'POST',
	//timeout: param.timeout,
	headers: {
	  'Content-Type': 'application/json; charset=utf-8',
	  'Content-Length': Buffer.byteLength(postDataStr, 'UTF-8'),
	  'Authorization': 'Bearer ' + this.apiKey
	}
      };
      return new Promise((resolve, reject) => {
	let req = http.request(options, (res) => {
	  if(res.statusCode === 200){
	    console.log('Machinist: Succeeded the sending, machinistAgent: ' + this.agent + ', machinistApiKey: ' + this.apiKey);
	    resolve(true);
	  }else{
	    console.error('machinist fail');
	    console.error('status: ' + res.statusCode);
	    console.error('header: ' + JSON.stringify(res.headers));
	    res.setEncoding('utf8');
	    res.on('data', (chunk) => {
	      console.error('body: ' + chunk);
	      reject(new Error('machinist error'));
	    });
	  }
	});
	req.on('error', (e) => {
	  console.error('problem with machinist http request: ' + e.message);
	  reject(new Error('Machinist http request error:' + e.message));
	});
	//req.on('timeout',()=>{request.abort();})
	req.write(postDataStr);
	req.end();
      });
    }else{
      console.log('Machinist: ' + this.stock.length.toString() + ' data stocked for Machinist');
      return true;
    }
  }
}
