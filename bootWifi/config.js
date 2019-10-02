/*
This is bootWifi setting file (Javascript source).
 
Setting is array of objects(ssid and passphrase). 

Priority of wifi connection is from head to tail in the array.

Followings are example of setting.

(複数のwifiを接続候補にすることができます。
以下のサンプルでは、まずssid1に優先的に接続が試みられ、ついでssid2、最後にss"id3になります。)

module.exports = [
  {ssid: "ssid1", passphrase: "pass111111111"}
  ,
  {ssid: "ssid2", passphrase: "!@#$%^&*()_+-="}
  ,
  {ssid: "ss\"id3", passphrase: "abcdef\"pqrstuv"}
];
*/

module.exports = [

];

