import { SendUser2Slack } from "../../src/useCase/sendUser";
import axios from "axios";
import { User } from "../../src/models/User";

describe("SendUser", () => {
  describe("#run", () => {
    it("throws a error if no slack webhook is passed", () => {
      expect(() => new SendUser2Slack({ slackWebhook: "" })).toThrow();
    });

    it("sends the request to slack web hook", async () => {
      const spyAxios = jest
        .spyOn(axios, "post")
        .mockImplementation(async () => ({}));
      const user: User = { photoURL: "", provider: "", email: "" };
      const subject = new SendUser2Slack({ slackWebhook: "anything" });

      await subject.run(user);

      expect(spyAxios).toHaveBeenCalledWith("anything", expect.anything());

      spyAxios.mockRestore();
    });

    it("sends the expected request body", async () => {
      const spyAxios = jest
        .spyOn(axios, "post")
        .mockImplementation(async () => ({}));
      const user: User = {
        photoURL: "photoURL",
        provider: "provider",
        email: "email"
      };
      const subject = new SendUser2Slack({ slackWebhook: "anything" });

      await subject.run(user);

      expect(spyAxios).toHaveBeenCalledWith(
        "anything",
        expect.objectContaining({
          blocks: expect.arrayContaining([
            expect.objectContaining({
              type: "section",
              accessory: {
                type: "image",
                image_url: user.photoURL,
                alt_text: "user avatar"
              },
              fields: expect.arrayContaining([
                {
                  type: "mrkdwn",
                  text: `*Name/email:*\n${user.email}`
                },
                {
                  type: "mrkdwn",
                  text: `*Login method:*\n${user.provider}`
                }
              ])
            })
          ])
        })
      );

      spyAxios.mockRestore();
    });
  });
});
