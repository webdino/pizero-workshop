'use strict';

const http = require('https');
const Record = require('./record.js');

const httpTimeoutMillisec = 10000; // http request timeout 10sec //

module.exports = class Machinist extends Record{
  /**
   * @param {{agent: string, apiKey: string, batchQuantity: number, format: function(any[]): any}} param
   */
  constructor(param){
    if(!(param.agent && param.apiKey && param.batchQuantity && param.format)) throw new Error('Machinist constructor needs agent, apiKey, batchQuantity, format.');
    super();
    this.writeTimeout = httpTimeoutMillisec; // set http timeout //
    this.stock = [];
    this.batchQuantity =  param.batchQuantity ? Math.max(param.batchQuantity, 1) : 1
    this.format = param.format;
    this.apiKey = param.apiKey;
    this.agent = param.agent.trim();// trim //
    this.writeCount = 0;
  }
  write(data){
    return new Promise((resolve, reject) => {
      this.stock.push(data);
      this.writeCount++;
      if(this.writeCount === 1 || this.writeCount % this.batchQuantity === 0){ // when first time, send to Ambient immidiately //
	console.log('Machinist: Send ' + this.stock.length.toString() + ' stocked data for machinistAgent: ' + this.agent + ', machinistApiKey: ' + this.apiKey + ' ...');
	let postDataStr = JSON.stringify(this.format(this.stock));
	this.stock = [];
	console.log(postDataStr);
	let options = {
	  host: 'gw.machinist.iij.jp',
	  port: 443,
	  path: '/endpoint',
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json; charset=utf-8',
	    'Content-Length': Buffer.byteLength(postDataStr, 'UTF-8'),
	    'Authorization': 'Bearer ' + this.apiKey
	  }
	};
	let req = http.request(options, (res) => {
	  res.setEncoding('utf8');
	  res.on('data', (chunk) => {
	    switch(res.statusCode){
	    case 200:
	      console.log('Machinist: Succeeded the sending, machinistAgent: ' + this.agent + ', machinistApiKey: ' + this.apiKey);
	      resolve(true);
	      break;
	    case 400://Bad Request
	      reject(new Error(`Machinist リクエストのフォーマットが不正です`));
	      break;
	    case 401://Unauthorized Access
	      reject(new Error(`Machinist 認証に失敗しました`));
	      break;
	    case 409://Conflict
	      reject(new Error(`Machinist リソース利用上限数に達しています`));
	      break;
	    case 422://Unprocessable Entity
	      reject(new Error(`Machinist リクエストボディのパラメータに問題があります`));
	      break;
	    case 429://Too Many Requests
	      reject(new Error(`Machinist 単位時間あたりの送信回数が規定値を超えています`));
	      break;
	    default:
	      reject(new Error(`Machinist response status is ${res.statusCode}, body is ${chunk}`));
	    }
	  });
	});
	req.setTimeout(this.writeTimeout);
	req.on('timeout',()=>{
	  req.abort();
	  reject(new Error('Machinist http request is not responsed, timeouted'));
	});
	req.on('error', (e) => {
	  reject(new Error('Machinist http request error:' + e.message));
	});
	req.write(postDataStr);
	req.end();
      }else{
	console.log('Machinist: ' + this.stock.length.toString() + ' data stocked for Machinist');
	resolve();
      }
    });
  }
}
