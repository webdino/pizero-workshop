/*
This is pizero-workshop config.js.

The configuration of single or mulitiple sensing and records are available as array of each setting objects.
Please fill the values of some properties (sensing and records interval time, sensor info, csv file path, machinist acount info, and ambient acount info).
*/

module.exports = [

  //first setting
  {
    intervalMillisec: 60000,    //sensing and record interval (milli second)

    //have to filled belows to sensing
    omron2jcieBu01Name: "Rbt", //maybe fix "Rbt"
    omron2jcieBu01Address: "", //12 charactors of number or aphabet (like "A1B2C3D4E5F6")

    //if filled below, saving csv file 
    csvFilename: "",           //csv file path for saving sensing data. if value is "", not saving.

    //if filled belows, uploading to Machinist
    machinistApiKey: "",       //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistAgent: "",        //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistBatchQuantity: 1, //number of temporary stock the sensing data before sending

    //if filled belows, uploading to Ambient
    ambinetChannelId: "",      //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambientWriteKey: "",       //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambietnBatchQuantity: 1    //number of temporary stock the sensing data before sending
  }

  ,
  
  //second setting
  {
    intervalMillisec: 60000,    //sensing and record interval (milli second)

    //have to filled belows to sensing
    omron2jcieBu01Name: "Rbt", //maybe fix "Rbt"
    omron2jcieBu01Address: "", //12 charactors of number or aphabet (like "A1B2C3D4E5F6")

    //if filled below, saving csv file 
    csvFilename: "",           //csv file path for saving sensing data. if value is "", not saving.

    //if filled belows, uploading to Machinist
    machinistApiKey: "",       //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistAgent: "",        //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistBatchQuantity: 1, //number of temporary stock the sensing data before sending

    //if filled belows, uploading to Ambient
    ambinetChannelId: "",      //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambientWriteKey: "",       //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambietnBatchQuantity: 1    //number of temporary stock the sensing data before sending
  }

  ,
  
  //third setting
  {
    intervalMillisec: 60000,    //sensing and record interval (milli second)

    //have to filled belows to sensing
    omron2jcieBu01Name: "Rbt", //maybe fix "Rbt"
    omron2jcieBu01Address: "", //12 charactors of number or aphabet (like "A1B2C3D4E5F6")

    //if filled below, saving csv file 
    csvFilename: "",           //csv file path for saving sensing data. if value is "", not saving.

    //if filled belows, uploading to Machinist
    machinistApiKey: "",       //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistAgent: "",        //from Machinist acount. if value is "", uploading to Machinst is disable.
    machinistBatchQuantity: 1, //number of temporary stock the sensing data before sending

    //if filled belows, uploading to Ambient
    ambinetChannelId: "",      //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambientWriteKey: "",       //from Ambient acount. if value is "", uploading to Ambient is disable.
    ambietnBatchQuantity: 1    //number of temporary stock the sensing data before sending
  }

  //more settings (fourth, fifth, ...) are available in following space with comma and setting objects like above.
  
  
];

