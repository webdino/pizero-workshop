/*
This is syncLog setting file (Javascript source).
Setting is array of objects. 
Followings are example of setting.

module.exports = [
  {
    type: 'rsync',                           //rsync
    intervalHours: 1,                        //execute interval hours
    source: '/home/pi/source_dir/',          //local directory
    dest: '/boot/data/'                      //local directory
  }
  ,
  {
    type: 'rclone',                          //rclone
    intervalHours: 24,                       //execute interval hours
    rcloneConf: '/boot/rclone.conf',         //file generated by rclone
    source: '/boot/data',                    //source directory
    destService: 'gdrive',                   //service name in rclone.conf
    destDir: 'data'                          //folder in cloud service
  }
];
*/

module.exports = [

];
