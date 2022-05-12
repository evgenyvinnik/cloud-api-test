/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const aws = require('aws-sdk');
const axios = require('axios').default;

exports.handler = async (event, context, callback)  => {
  context.callbackWaitsForEmptyEventLoop = false;

  let httpMethod;

  if (event.context !== undefined) {
    httpMethod = event.context["http-method"];
  } else {
    //used to test with lambda-local
    httpMethod = "PUT";
  }

  if (httpMethod === "GET") {
    const queryParams = event.params.querystring;
    const mode = queryParams["hub.mode"];
    if (mode === "subscribe") {
      const { Parameters } = await (new aws.SSM())
        .getParameters({
          Names: ["verify_token"].map(secretName => process.env[secretName]),
          WithDecryption: true,
        })
        .promise();
      const VERIFY_TOKEN = Parameters.pop().Value;
      const verifyToken = queryParams["hub.verify_token"];
      if (verifyToken === VERIFY_TOKEN) {
        var challenge = queryParams["hub.challenge"];
        callback(null, parseInt(challenge));
      } else {
        callback(null, "Error, wrong validation token");
      }
    } else {
      callback(null, "Error, wrong mode");
    }
  } else {
    // process POST request (WhatsApp chat messages)
    let entries = event["body-json"].entry;
    for (let entry of entries) {
      for (let change of entry.changes) {
        let value = change.value;
        let phone_number_id = value.metadata.phone_number_id;
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
            axios({
              method: "POST",
              url:
                "https://graph.facebook.com/v12.0/" +
                phone_number_id +
                "/messages?access_token=" +
                WHATSAPP_TOKEN,
              data: {
                messaging_product: "whatsapp",
                to: from,
                text: { body: "Ack from AWS lambda: " + message_body },
              },
              headers: { "Content-Type": "application/json" },
            });
            callback(null, "Done");
          }
        }
      }
    }
    
    callback(null, event);
  }
}