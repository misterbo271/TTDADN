const urlMqtt = "mandoansinh/feeds";
const Light = require("../model/Lights");
const Floor = require("../model/Floors");

//server
var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://io.adafruit.com:1883", {
  username: "mandoansinh",
  password: "aio_uTTo47Jc7erGKZ0hXiD1MBYQ05V2",
  clientId: "mqttjs01",
});

client.on("connect", function () {
  console.log("connected");
});

Floor.find().then((floors) => {
  for (const i in floors) {
    client.subscribe(`${urlMqtt}/${floors[i].nameFloor}`);
    client.on("message", function (topic, message, packet) {
      var sensor = JSON.parse(message);
      if (topic.includes(`${floors[i].nameFloor}`) && sensor === 3) {
        if (sensor === 0) {
          sensor = "00";
        } else if (sensor === 1) {
          sensor = "01";
        } else if (sensor === 2) {
          sensor = "02";
        } else if (sensor === 3) {
          sensor = "11";
        }
        Floor.findByIdAndUpdate(
          { _id: `${floors[i]._id}` },
          { sensor: sensor }
        );
        Light.find({ floor: floors[i]._id }).then((lights) => {
          for (const j in lights) {
            let data = { value: `${lights[j].status}` };
            console.log("i'm here", data);
            client.publish(
              `${urlMqtt}/${lights[j].nameLight}`,
              JSON.stringify(data)
            );
          }
        });
      }
    });
  }
});

module.exports = client;
