/*
Following is a sample of pizero-workshop config.js.
Plearse export the array of setting object (sensing and record interval time, sensor info, csv file path, machinist acount info, ambient acount info).

//sample setting object of sensing and record to csv, machinist, ambient 
const setting1 =   {
  intervalMillisec: 60000    //sensing and record interval (milli second)
  omron2jcieBu01Name: "Rbt", //maybe fix "Rbt"
  omron2jcieBu01Address: "", //12 charactors of number or aphabet (like "A1B2C3D4E5F6")
  csvFilename: "",           //csv file path for saving sensing data
  machinistApikey: "",       //from machinist acount
  machinistAgent: "",        //from machinist acount
  machinistBatchQuantity: 1, //temporary stock number of sensing data before sending
  ambinetChannelId: 0,       //from ambient acount (number)
  ambientWriteKey: "",       //from ambient acount
  ambietnBatchQuantity: 1    //temporary stock number of sensing data before sending
}

//sample setting object of sensing and record to machinist
const machinist =   {
  intervalMillisec: 60000
  omron2jcieBu01Name: "Rbt",
  omron2jcieBu01Address: "", 
  machinistApikey: "",       
  machinistAgent: "",        
  machinistBatchQuantity: 1
}

//sample setting object of sensing and record to csv, ambient
const ambientAndCsv =   {
  intervalMillisec: 60000
  omron2jcieBu01Name: "Rbt",
  omron2jcieBu01Address: "", 
  csvFilename: "",
  ambinetChannelId: 0,     
  ambientWriteKey: "",     
  ambietnBatchQuantity: 1  
}

//sample setting object of sensing and record to csv
const csvOnly =   {
  intervalMillisec: 60000
  omron2jcieBu01Name: "Rbt",
  omron2jcieBu01Address: "",
  csvFilename: ""
}

//must exports array of each setting object like this.
module.exports = [setting1, machinistAndCsv, csvOnly];

*/

module.exports = [

];
