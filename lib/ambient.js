'use strict';
/*
 * Author: TAKASHI NISHIO
 * Created: 2019.8.11
 */

const ambient = require('ambient-lib');
const Record =  require('./record.js');

module.exports = class Ambient extends Record{
  constructor(param){
    super();
    ambient.connect(param.channel_id, param.write_key, param.read_key, param.user_id);
    let datas = [];
    let limit = (param.multiple && param.multiple > 1) ? param.multiple : 1
    let first_time = true;
    this.format = param.format;
  }
  write(data){
    datas.push(data);
    if(!first_time && datas.length < limit){
      console.log(datas.length.toString() + ' data stocked');
      return true;
    }else{
      first_time = false;
      console.log('send ' + datas.length.toString() + ' stocked datas... ');
      return new Promise((resolve, reject) => {
	ambient.send(this.format(datas), (err, res, body)=>{
	  console.log('done');
	  datas = [];
	  err && (console.error(err), process.exit(1));
	  resolve(true);
	});
      });
    }
  }
}

