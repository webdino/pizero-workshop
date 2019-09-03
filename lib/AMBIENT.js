'use strict';
/*
 * Author: TAKASHI NISHIO
 * Created: 2019.8.11
 */

const ambient = require('ambient-lib');
module.exports = function(param){
    ambient.connect(param.channel_id, param.write_key, param.read_key, param.user_id);
    let datas = [];
    let limit = (param.multiple && param.multiple > 1) ? param.multiple : 1
    return {
	record: (data)=>{
	    datas.push(data);
	    if(datas.length < limit){
		console.log(datas.length.toString() + ' data stocked');
		return true;
	    }else{
		console.log('send ' + datas.length.toString() + ' stocked datas... ');
		return new Promise((resolve, reject) => {
		    ambient.send(param.format(datas), (err, res, body)=>{
			console.log('done');
			datas = [];
			err && (console.log(err), process.exit(1));
			resolve(true);
		    });
		});
	    }
	}
    }
}
