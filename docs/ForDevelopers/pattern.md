# pattern.js

Libray of pattern using Sensor class object and Record class objects, this module exports `function sensorRecords`.

#### Usage example
```javascript
let pattern = require('file path to this pattern.js');

let Omron2jcieBu01 = require('file path to omron2jcieBu01.js');
let Csv = require('file path to omron2jcieBu01.js');
let Machinist = require('file path to machinist.js');
let Ambient = require('file path to ambient.js');

let omron2jcieBu01 = new Omron2jcieBu01(...); // sensor object //

let csv = new Csv(...); // record object //
let machinist = new Machinist(...); // record object //
let ambient = new Ambient(...); // record object //

pattern.sensorRecords({
  sensor: omron2jcieBu01, // sensor object
  records: [csv, machinist, ambient], // array of record objects
  intevalMillisec: 60000 
});
```
Above is sensing by using omron2jcieBu01, and writing (adding) data to local csv file, and uploading data to Machinist and Ambient, and loop this in interval.