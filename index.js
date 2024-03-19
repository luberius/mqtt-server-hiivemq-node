require("dotenv").config();
var mqtt = require("mqtt");

var options = {
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT, 10),
  protocol: process.env.MQTT_PROTOCOL,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

var client = mqtt.connect(process.env.MQTT_HOST, options);

client.on("connect", function () {
  console.log("Connected");
});

client.on("error", function (error) {
  console.log(error);
});

client.on("message", function (topic, message) {
  console.log("Received message:", topic, message.toString());
});

client.subscribe("message/topic");
client.publish("message/topic", "Hello");
