// @ts-check
const path = require("path");
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const port = Number(process.env.PORT) || 3000;

function main(
  { enable, ...options } = {
    enable: false,
    /** @type {(({ temperature, relativeHumidity, barometricPressure, ambientLight, soundNoise, eTVOC, eCO2 }) => boolean) | undefined} */
    notifyWhen: undefined
  }
) {
  if (!enable) return;

  const notifyWhen = options.notifyWhen || (() => false);

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
