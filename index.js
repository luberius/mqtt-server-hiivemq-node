require("dotenv").config();
var mqtt = require("mqtt");

var options = {
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT, 10),
  protocol: process.env.MQTT_PROTOCOL,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

var client = mqtt.connect(process.env.MQTT_HOST, options);
let cancelPublishing = false;

client.on("connect", function () {
  console.log("Connected");
});

client.on("error", function (error) {
  console.log(error);
});

const lorem =
  "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.";

client.on("message", function (topic, message) {
  let receivedMessage = {};
  console.log("Received message:", topic, receivedMessage);

  try {
    receivedMessage = JSON.parse(message.toString());
  } catch (e) {
    console.log(e);
  }

  console.log("sender", receivedMessage.sender);

  if (!receivedMessage.sender || receivedMessage.sender === "server") {
    return;
  }

  if (receivedMessage.type === "cancel") {
    console.log("Cancelling the publishing process.");
    cancelPublishing = true;
    client.publish(
      topic,
      JSON.stringify({ sender: "server", type: "done", content: "" }),
    );
  } else {
    cancelPublishing = false;
    publishWordByWord(receivedMessage, "message/topic");
  }
});

async function publishWordByWord(message, topic) {
  const sendImage = message.content?.includes("image");
  const loremWords = lorem.split(" ");

  for (const word of loremWords) {
    if (cancelPublishing) {
      console.log("Publishing was cancelled.");
      break;
    }
    const messageContent = JSON.stringify({
      sender: "server",
      type: "message",
      content: word,
    });
    client.publish(topic, messageContent);
    console.log(`Published: ${messageContent}`);
    await delay(1000);
  }

  if (sendImage) {
    const imgMessage = JSON.stringify({
      sender: "server",
      type: "image",
      content: "https://source.unsplash.com/random",
    });
    client.publish(topic, imgMessage);
    console.log(`Published: ${imgMessage}`);
  }
  client.publish(
    topic,
    JSON.stringify({ sender: "server", type: "done", content: "" }),
  );
}

client.subscribe("message/topic");
client.publish("message/topic", "Hello");
