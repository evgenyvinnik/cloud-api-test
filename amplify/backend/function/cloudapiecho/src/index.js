/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const aws = require('aws-sdk');
const https = require("https");

exports.handler = async (event)  => {
  let response;
  if (event.httpMethod === "GET") {
    let queryParams = event.multiValueQueryStringParameters;
    if (queryParams != null) {
      const mode = queryParams["hub.mode"];
      if (mode == "subscribe") {
        const { Parameters } = await (new aws.SSM())
          .getParameters({
            Names: ["verify_token"].map(secretName => process.env[secretName]),
            WithDecryption: true,
          })
          .promise();
        const VERIFY_TOKEN = Parameters.pop().Value;
        const verifyToken = queryParams["hub.verify_token"];
        if (verifyToken == VERIFY_TOKEN) {
          let challenge = queryParams["hub.challenge"];
          response = {
              "statusCode": 200,
              "body": parseInt(challenge),
              "isBase64Encoded": false
          };
        } else {
          const responseBody = "Error, wrong validation token";
          response = {
              "statusCode": 403,
              "body": JSON.stringify(responseBody),
              "isBase64Encoded": false
          };
        }
      } else {
          const responseBody = "Error, wrong mode";
          response = {
              "statusCode": 403,
              "body": JSON.stringify(responseBody),
              "isBase64Encoded": false
        };
      }
    }
    else {
      const responseBody = "Error, no query parameters";
      response = {
          "statusCode": 403,
          "body": JSON.stringify(responseBody),
          "isBase64Encoded": false
      };
    }
  } else if (event.httpMethod === "POST") {
    // process POST request (WhatsApp chat messages)
    let body = JSON.parse(event.body)
    let entries = body.entry;
    for (let entry of entries) {
      for (let change of entry.changes) {
        let value = change.value;
        if(value != null) {
          let phone_number_id = value.metadata.phone_number_id;
          if (value.messages != null) {
            for (let message of value.messages) {
              if (message.type === 'text') {
                const { Parameters } = await (new aws.SSM())
                  .getParameters({
                    Names: ["whatsapptoken"].map(secretName => process.env[secretName]),
                    WithDecryption: true,
                  })
                  .promise();
                const WHATSAPP_TOKEN = Parameters.pop().Value;
                let from = message.from;
                let message_body = message.text.body;
                let reply_message = "Ack from AWS lambda: \n" + 
                                    "W🟨 O🟩 R⬜️ D🟩 S⬜️\n" +
                                    "\n" +
                                    "qwertyuiop\n" +
                                    "asdfghjkl\n" +
                                    "zxcvbnm\n" +
                                    "QWERTYUIOP\n" +
                                    "ASDFGHJKL\n" +
                                    "ZXCVBNM\n" +
                                    "q w e r t y u i o p\n" +
                                    "a s d f g h j k l\n" +
                                    "z x c v b n m\n" +
                                    "Q W E R T Y U I O P\n" +
                                    "A S D F G H J K L\n" +
                                    "Z X C V B N M\n" +
                                    "q W e R t y u i O p\n" +
                                    "a S D f g h j k l\n" +
                                    "z x c v b n m\n" +
                                    "q W🟨 E🟩 R🟩 T🟩 y u I🟩 o p\n" +
                                    "a s d f g h j k l\n" +
                                    "z x c v b n m\n" +
                                    message_body;
                sendReply(phone_number_id, WHATSAPP_TOKEN, from, reply_message);
                const responseBody = "Done";
                response = {
                    "statusCode": 200,
                    "body": JSON.stringify(responseBody),
                    "isBase64Encoded": false
                };
              }
            }
          }
        }
      }
    }
  } else {
    const responseBody = "Unsupported method";
    response = {
        "statusCode": 403,
        "body": JSON.stringify(responseBody),
        "isBase64Encoded": false
    };
  }
  return response;
}

const sendReply = (phone_number_id, whatsapp_token, to, reply_message) => {
  let json = {
    messaging_product: "whatsapp",
    to: to,
    text: { body: reply_message },
  };
  let data = JSON.stringify(json);
  let path = "/v12.0/"+phone_number_id+"/messages?access_token="+whatsapp_token;
  let options = {
    host: "graph.facebook.com",
    path: path,
    method: "POST",
    headers: { "Content-Type": "application/json" }
  };
  let callback = (response) => {
    let str = "";
    response.on("data", (chunk) => {
      str += chunk;
    });
    response.on("end", () => {
    });
  };
  let req = https.request(options, callback);
  req.on("error", (e) => {});
  req.write(data);
  req.end();
}