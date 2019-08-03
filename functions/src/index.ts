import * as functions from "firebase-functions";
import axios from "axios";

export const users2slack = functions.auth
  .user()
  .onCreate(({ displayName, email, photoURL, providerData }) => {
    return axios.post(functions.config().slack.webhook, {
      blocks: [
        {
          type: "section",
          accessory: {
            type: "image",
            image_url: photoURL || "https://i.imgur.com/6feqAhn.png",
            alt_text: "user avatar"
          },
          fields: [
            {
              type: "mrkdwn",
              text: `*Name/email:*\n${displayName || email}`
            },
            {
              type: "mrkdwn",
              text: `*When:*\n<!date^${Math.floor(
                Date.now() / 1000
              )}^ {date_short}|Fail to parse date>`
            },
            {
              type: "mrkdwn",
              text: `*Login method:*\n${providerData[0].providerId}`
            }
          ]
        }
      ]
    });
  });
