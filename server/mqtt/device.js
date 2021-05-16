//iot device
var mqtt = require("mqtt");
var divice = mqtt.connect("mqtt://io.adafruit.com:1883", {
  username: "mandoansinh",
  password: "aio_uTTo47Jc7erGKZ0hXiD1MBYQ05V2",
  clientId: "mqttjs02",
});

divice.on("connect", function () {
  console.log("Device connected");
});
let data = { value: 3 };
divice.publish("mandoansinh/feeds/f1-s", JSON.stringify(data));
