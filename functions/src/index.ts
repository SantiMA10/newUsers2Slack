import * as functions from "firebase-functions";
import { User } from "./models/User";
import { SendUser2Slack } from "./useCase/SendUser";

export const users2slack = functions.auth
  .user()
  .onCreate(async ({ displayName, email, photoURL, providerData }) => {
    const user: User = {
      name: displayName,
      email,
      photoURL,
      provider: providerData[0].providerId
    };

    await new SendUser2Slack({
      defaultPhotoUrl: functions.config().mods.defaultphotourl,
      slackWebhook: functions.config().slack.webhook
    }).run(user);

    return true;
  });
