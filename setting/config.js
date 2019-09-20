// Sample 
/*
複数のwifiを接続候補にすることができます。
下のサンプルでは、一番先に記述されているssid1に優先的に接続が試みられ、ついでssid2、最後にssid"3%@になります。
*/
/*
wifi:
[
  {ssid: "ssid1", passphrase: "111passphrase111"}
  ,
  {ssid: "ssid2", passphrase: "abc!@#$\"%^&*()"}
  ,
  {ssid: "ssid\"3%@", passphrase: "\"<>?;:'[]{}\=+-_"}
]
*/

module.exports = {
  wifi:   
  [
    {ssid: "", passphrase: ""}
    ,
    {ssid: "", passphrase: ""}
  ]
  ,
  omron2jcieBu01_Csv_Machinist:
  [
    {
      intervalMillisec: 60000
      omron2jcieBu01Name: "Rbt",
      omron2jcieBu01Address: "",
      csvFilename: "",
      machinistApikey: "",
      machinistAgent: "",
      machinistMultiple: 1,
    }
    ,
    {
      intervalMillisec: 60000
      omron2jcieBu01Name: "Rbt",
      omron2jcieBu01Address: "",
      csvFilename: "",
      machinistApikey: "",
      machinistAgent: "",
      machinistMultiple: 1,
    }
  ]
}

