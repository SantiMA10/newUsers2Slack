import { UseCase } from "./UseCase";
import axios from "axios";
import { User } from "../models/User";
import { isNil, isEmpty } from "lodash";

interface Options {
  defaultPhotoUrl?: string;
  slackWebhook: string;
}

export class SendUser2Slack implements UseCase<User, void> {
  private defaultPhotoUrl?: string;
  private slackWebhook: string;

  public constructor({ defaultPhotoUrl, slackWebhook }: Options) {
    if (isNil(slackWebhook) || isEmpty(slackWebhook)) {
      throw new Error("Missing slack webhook");
    }

    this.slackWebhook = slackWebhook;
    this.defaultPhotoUrl = defaultPhotoUrl;
  }

  public run(user: User): Promise<void> {
    const slackMessage = this.createMessage(user);

    return axios.post(this.slackWebhook, slackMessage);
  }

  private createMessage(user: User): any {
    const { photoURL, email, name, provider } = user;

    return {
      blocks: [
        {
          type: "section",
          accessory: {
            type: "image",
            image_url: photoURL || this.defaultPhotoUrl,
            alt_text: "user avatar"
          },
          fields: [
            {
              type: "mrkdwn",
              text: `*Name/email:*\n${name || email}`
            },
            {
              type: "mrkdwn",
              text: `*When:*\n<!date^${Math.floor(
                Date.now() / 1000
              )}^ {date_short}|Fail to parse date>`
            },
            {
              type: "mrkdwn",
              text: `*Login method:*\n${provider}`
            }
          ]
        }
      ]
    };
  }
}
