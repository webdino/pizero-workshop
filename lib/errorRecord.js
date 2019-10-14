'use strict';

require('date-utils');
const Record = require('./record.js');

let db = {}; // access from all this class instance //

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
	// same error only less than 10 or 100 1000 10000 100000 ... times, output to console.error //
	if(value.count < 10 || Math.floor(Math.log10(value.count)) === Math.log10(value.count))
	  console.error(`${new Date().toFormat("YYYY-MM-DD HH24:MI:SS")} : ${value.count} times : ${key}`);
      }else{
	// when first time new kind of error //
	db[key] = {count:1, error: e};
	console.error(`${new Date().toFormat("YYYY-MM-DD HH24:MI:SS")} : First times : `);
	console.error(e);
      }
      resolve();
    });
  }
}
