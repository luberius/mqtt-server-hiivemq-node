require("dotenv").config();
var mqtt = require("mqtt");

var options = {
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT, 10),
  protocol: process.env.MQTT_PROTOCOL,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

var client = mqtt.connect(
  "bdacb9722f6b4e129c0a6d757fe1b184.s1.eu.hivemq.cloud",
  options,
);

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
