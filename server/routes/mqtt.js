const mqtt = require("mqtt");

const options = {
  clientId: "mqttjs01",
  username: "srdb2031",
  password: "aio_XWaI97LsLAGsx8BMnAb5dRW6CqBr",
  port: 1883 || 8883,
  host: "io.adafruit.com",
  clean: true,
};
const client = mqtt.connect(options);

client.on("connect", () => {
  console.log("connected successfully");
});

client.on("error", (error) => {
  console.log("Can't connect" + error);
});

module.exports = client;
