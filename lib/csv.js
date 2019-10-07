// @ts-check
'use strict';

require('date-utils');
const fs = require('fs');
const Record = require('./record.js');

/**
 * @param {string} file
 */
function isExistFile(file) {
  try {
    fs.statSync(file);
    return true
  } catch(err) {
    if(err.code === 'ENOENT') return false
  }
}

module.exports = class Csv extends Record {
  /**
   * @param {{date: any, dateFormat: (string | undefined | null), order: string[], path: string}} param
   */
  constructor(param){
    super();
    this.date = param.date;
    this.dateFormat = param.dateFormat;
    this.order = param.order;
    this.path = param.path;
  }
  write(data){
    return new Promise((resolve, reject)=>{
      let line = this.date ? (new Date(data.timestamp).toFormat(this.dateFormat || "YYYY-MM-DD HH24:MI:SS") + ",") : ''
      this.order.forEach((prop)=>line += (data[prop] + ','));
      line = line.substring(0, line.length - 1);
      console.log(line);
      console.log("Csv: add to '" + this.path + "'...");
      //csv header
      if((! isExistFile(this.path)) || fs.statSync(this.path).size==0)
	line = (this.date ? 'time,' : '') + this.order.join(',') + "\n" + line;
      fs.appendFile(this.path, line+"\n" , (err)=>{
	if(err)	{
	  reject(err);
	}else{
	  console.log("Csv: Succeeded the adding, '" + this.path + '"');
	  resolve();
	}
      });
    });
  }
}
