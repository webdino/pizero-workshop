# ambient.js

Library for sending some data to [Ambient](https://ambidata.io/), this module exports `class Ambient`.

## Ambient class (extends Record class)
#### Usage example
```javascript
let Ambient = require('file path to this ambient.js');

let ambient = new Ambient({
   channelId: param.ambientChannelId,
   writeKey: param.ambientWriteKey,
   readKey: param.ambientReadKey,
   userId: param.ambientUserId,
   batchQuantity: param.ambientBatchQuantity,
   format: (datas)=>datas.map((data)=>{
      return {
      	 created: new Date(data.timestamp).toFormat('YYYY-MM-DD HH24:MI:SS'),
	 d1: data.a,
	 d2: data.b,
   };})
});

ambient.write({a: 1, b: 2, timestamp: new Date.getTime()});
```

#### Constructor & Method
- constructor
  - argument is one object
  ```
  {
    channelId: string,
    writeKey: string,
    readKey: string, (option)
    userId: string, (option)
    batchQuantity: number, (option, default 1)
    format: function 
  }
  ```  

- `write` method
  - argument is one object
  
  ```
  {
    key0: any
    key1: any
    key2: any
    ...
    timestamp: number (unix time)
  }
  ```  
    
  - return a Promise object (this resolve function return nothing) or reject error object `Ambient writeKey might be invalid` or `Ambient channelId might be invalid` or valiable errors (?) `Ambient Error, response status code is ?, response body is ?`

#### format function in constructor argument
Like above sample, argument of `format` function, `datas` is an array (this is internal stocks of which from `write` method argument), and `format` function return formated objects array.

```javascript
   format: (datas)=>datas.map((data)=>{
      return {
      	 created: new Date(data.timestamp).toFormat('YYYY-MM-DD HH24:MI:SS'),
	 d1: data.a,
	 d2: data.b,
   };})
```
