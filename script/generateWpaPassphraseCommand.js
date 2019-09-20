let config = require(process.argv[2]);

try {
  let priority = config.wifi.length
  config.wifi.forEach((spot)=>{
    let command = "priority=" + priority + ";";
    command += "wpa_passphrase " + JSON.stringify(spot.ssid) + " " + JSON.stringify(spot.passphrase);
    command += "| sed \"s/\#psk=.*$/priority=${priority}/\";"
    priority -= 1
    console.log(command);
  });
} catch (e) {
  console.error(e);
  process.exit(1);
}
process.exit(0);

