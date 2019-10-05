/*
This is bootWifi setting file (Javascript source).

Setting is array of objects (ssid and passphrase). 
Priority of wifi connection is from head to tail in the array.

複数のwifiアクセスポイントへの接続設定ができます。
上に記述したものから順に優先的に接続されます。
SSIDとパスワードを、ダブルクォーテーションの間（"と"の間）に記述してください。　
*/

module.exports = [

  //１番優先的に接続させたいアクセスポイント
  {ssid: "", passphrase: ""}

  ,
  
  //次に優先的に接続させたいアクセスポイント（ないならそのままでよい）
  {ssid: "", passphrase: ""}

  ,
  
  //３番優先的に接続させたいアクセスポイント（ないならそのままでよい）
  {ssid: "", passphrase: ""}

  ,
  
  //４番優先的に接続させたいアクセスポイント（ないならそのままでよい）
  {ssid: "", passphrase: ""}

  ,
  
  //５番優先的に接続させたいアクセスポイント（ないならそのままでよい）
  {ssid: "", passphrase: ""}

  //以降、よりたくさんのアクセスポイントの接続設定をすることができます。その場合はカンマで区切って同様に記述してください。
];

