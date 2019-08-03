import { User } from "./models/User";
import { SendUser2Slack } from "./useCase/SendUser";

export const sendNewUsers2Slack = async ({
  displayName,
  email,
  photoURL,
  providerData
}: any) => {
  const user: User = {
    name: displayName,
    email,
    photoURL,
    provider: providerData[0].providerId
  };

  await new SendUser2Slack({
    defaultPhotoUrl: process.env.DEFAULT_AVATAR,
    slackWebhook: process.env.SLACK_WEBHOOK as string
  }).run(user);

  return true;
};
