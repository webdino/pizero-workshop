'use strict';
/*
 * Author: TAKASHI NISHIO
 * Created: 2019.8.28
 */

require('date-utils');
const fs = require('fs');

function isExistFile(file) {
    try {
	fs.statSync(file);
	return true
    } catch(err) {
	if(err.code === 'ENOENT') return false
    }
}

module.exports = function(param){
    return {
	record: (data)=>{
	    return new Promise((resolve, reject)=>{
		let line = param.date ? (new Date(data.timestamp).toFormat(param.date_format || "YYYY-MM-DD HH24:MI:SS") + ",") : ''
		param.order.forEach((prop)=>line += (data[prop] + ','));
		line = line.substring(0, line.length - 1);
		console.log(line);
		console.log("Add to '" + param.path + "'...");
		//csv header
		if((! isExistFile(param.path)) || fs.statSync(param.path).size==0){
		    line = (param.date ? 'time,' : '') + param.order.join(',') + "\n" + line;
		}
		fs.appendFile(param.path, line+"\n" , (err)=>{
		    if(err){ reject(); throw err;}
		    console.log("Added to '" + param.path + '"');
		    resolve(true);
		});
	    });
	}
    }
}


    
    
