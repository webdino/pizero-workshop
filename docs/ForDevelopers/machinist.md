# machinist.js

Library for sending some data to [Machinist](https://machinist.iij.jp/), this module exports `class Machinist`.

## Machinist class (extends Record class)
#### Usage example
```javascript
let machinist = require('file path to this machinist.js');

let machinist = new Machinist({
  agent: "agent_something",
  apiKey: "xxxxxxxxxx",
  batchQuantity: 1,
  format: (datas)=>{
  let metrics = [];
  datas.forEach((data)=>{
  let timestamp = Math.floor(data.timestamp / 1000);
  metrics.push({
  name: "a",
  namespace: "namespace_somethig",
  data_point: {value: data.a, timestamp: timestamp}});
  metrics.push({
  name: "b",
  namespace: "namespace_somethig",
  data_point: {value: data.b, timestamp: timestamp}});});
  return {agent: "agent_something",
  metrics: metrics};}
  });

machinist.write({a: 1, b: 2, timestamp: new Date.getTime()});
```

#### Constructor & Method
- constructor
  - argument is one object
  ```
  {
     agent: string, 
     apiKey: string, 
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

  - return a Promise object (this resolve function return nothing) or reject error object `Machinist リクエストのフォーマットが不正です` or `Machinist 認証に失敗しました` or `Machinist リソース利用上限数に達しています`
 or `Machinist リクエストボディのパラメータに問題があります` or `Machinist 単位時間あたりの送信回数が規定値を超えています` or valiable errors (?) `Machinist response status is ?, body is ?` or `Machinist http request is not responsed, timeouted` or valiable errors (?) `Machinist http request error: ?`

#### format function in constructor argument
Like above sample, argument of `format` function, `datas` is an array (this is internal stocks of which from `write` method argument), and `format` function return object of `agent` and `metrics`.

```javascript
  format: (datas)=>{
  let metrics = [];
  datas.forEach((data)=>{
  let timestamp = Math.floor(data.timestamp / 1000);
  metrics.push({
  name: "a",
  namespace: "namespace_somethig",
  data_point: {value: data.a, timestamp: timestamp}});
  metrics.push({
  name: "b",
  namespace: "namespace_somethig",
  data_point: {value: data.b, timestamp: timestamp}});});
  return {agent: "agent_something",
  metrics: metrics};}
```