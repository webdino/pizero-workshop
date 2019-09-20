let config = require(process.argv[2]);

try {
  console.log(config.omron2jcieBu01_Csv_Machinist);
  config.omron2jcieBu01_Csv_Machinist &&
    config.omron2jcieBu01_Csv_Machinist.forEach((c)=>{
      console.log(
`${process.argv[3]}/log/${c.csvFilename} \{
  weekly
  dateext
  dateformat %Y%m%d
  postrotate
    mv $dir/log/name.csv-\`date '+%Y%m%d'\` $dir/log/name.\`date '+%Y%m%d'\`.csv
  rotate 100
  missingok
  nocompress
  ifempty
  create 0640 pi pi
\}
`)});
} catch (e) {
  console.error(e);
  process.exit(1);
}
process.exit(0);

