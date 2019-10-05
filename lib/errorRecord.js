'use strict';

require('date-utils');
const Record = require('./record.js');

let db = {};

module.exports = class ErrorRecord extends Record {
  constructor(param){
    super();
  }
  write(e){
    return new Promise((resolve, reject)=>{
      const key = e.toString();
      const value = db[key];    
      if(value){
	value.count++;
	if(value.count < 10 || Math.floor(Math.log10(value.count)) === Math.log10(value.count))
	  console.error(`${new Date().toFormat("YYYY-MM-DD HH24:MI:SS")} : ${value.count} times : ${key}`);
      }else{
	db[key] = {count:1, error: e};
	console.error(`${new Date().toFormat("YYYY-MM-DD HH24:MI:SS")} : First times : `);
	console.error(e);
      }
      resolve(true);
    });
  }
}
