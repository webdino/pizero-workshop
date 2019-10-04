let config = require(process.argv[2]);

let command = '';
try {
  let priority = config.length
  config && config.forEach((spot)=>{
    command += "priority=" + priority + ";";
    command += "wpa_passphrase " + JSON.stringify(spot.ssid) + " " + JSON.stringify(spot.passphrase);
    command += "| sed \"s/\#psk=.*$/priority=${priority}/\";"
    priority -= 1
  });
} catch (e) {
  console.error(e);
  process.exit(1);
}
console.log(command);
process.exit(0);
