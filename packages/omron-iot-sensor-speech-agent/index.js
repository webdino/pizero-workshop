// @ts-check

const OpenJTalk = require("openjtalk");

function main(
  { enable, notifyWhen, notifyScript } = {
    enable: false,
    /** @type {({ temperature, relativeHumidity, barometricPressure, ambientLight, soundNoise, eTVOC, eCO2 }) => boolean} */
    notifyWhen: () => true,
    /** @type {({ temperature, relativeHumidity, barometricPressure, ambientLight, soundNoise, eTVOC, eCO2 }) => string} */
    notifyScript: ({
      temperature,
      relativeHumidity,
      barometricPressure,
      ambientLight,
      soundNoise,
      eTVOC,
      eCO2
    }) =>
      [
        "現在",
        `温度${temperature}度`,
        `湿度${relativeHumidity}パーセント`,
        `大気圧${barometricPressure}ヘクトパスカル`,
        `照度${ambientLight}ルクス`,
        `騒音${soundNoise}デシベル`,
        `総揮発性有機化合物${eTVOC}ピーピービー`,
        `二酸化炭素濃度${eCO2}ピーピーエム`
      ].join("。")
  }
) {
  if (!enable) return;

  const talker = new OpenJTalk();

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
      if (!notifyWhen(data)) return;

      talker.talk(
        [
          "っ。", // FIXME: HDMIの音声出力を使うと最初数ミリ秒出力されない
          notifyScript(data)
        ].join("")
      );
    }
  };
}

module.exports = main;