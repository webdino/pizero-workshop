'use strict';
/*
 * Author: TAKASHI NISHIO
 * Created: 2019.8.11
 */

const http = require('https');
const Record = require('./record.js');

module.exports = class Machinist extends Record{
  constructor(param){
    super();
    this.datas = [];
    this.multiple = (param.multiple && param.multiple > 1) ? param.multiple : 1
    this.first_time = true;
    this.format = param.format;
    this.apikey = param.apikey;
  }
  write(data){
    datas.push(data);
    if(! this.first_time && datas.length < this.multiple){
      console.log(datas.length.toString() + ' data stocked');
      return true;
    }
    else{
      this.first_time = false;
      console.log('send ' + datas.length.toString() + ' stocked data... ');
      let postDataStr = JSON.stringify(this.format(datas));
      this.datas = [];
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
	  'Authorization': 'Bearer ' + this.apikey
	}
      };
      return new Promise((resolve, reject) => {
	let req = http.request(options, (res) => {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  res.on('data', (chunk) => {
	    console.log('BODY: ' + chunk);
	    resolve(true);
	  });
	});
	req.on('error', (e) => {
	  console.error('problem with request: ' + e.message);
	  reject(new Error('Machinist error:' + e.message));
	});
	//req.on('timeout',()=>{request.abort();})
	req.write(postDataStr);
	req.end();
      });
    }
  }
}
