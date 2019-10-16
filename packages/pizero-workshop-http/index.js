// @ts-check
const path = require("path");
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const port = Number(process.env.PORT) || 3000;

function main() {
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
    }
  };
}

module.exports = main;
