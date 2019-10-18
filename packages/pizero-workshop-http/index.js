// @ts-check
const path = require("path");
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const port = Number(process.env.PORT) || 3000;

function main(
  { enable, notifyWhen } = {
    enable: false,
    /** @type {({ temperature, relativeHumidity, barometricPressure, ambientLight, soundNoise, eTVOC, eCO2 }) => boolean} */
    notifyWhen: () => false
  }
) {
  if (!enable) return;

  app.get("/", function(_, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  http.listen(port, function() {
    console.log(`listening on http://localhost:${port}`);
  });

  return {
    /**
     * @param {{
     *   temperature: number,
     *   relativeHumidity: number,
     *   barometricPressure: number,
     *   ambientLight: number,
     *   soundNoise: number,
     *   eTVOC: number,
     *   eCO2: number
     * }} data
     */
    async write(data) {
      io.send(data);

      if (notifyWhen(data)) io.emit("notify");
    }
  };
}

module.exports = main;
