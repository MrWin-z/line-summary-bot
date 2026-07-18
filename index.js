const express = require("express");
const line = require("@line/bot-sdk");

const app = express();

const config = {
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
};

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

app.get("/", (req, res) => {
  res.status(200).send("LINE Summary Bot is running");
});

app.post("/webhook/line", line.middleware(config), async (req, res) => {
  try {
    await Promise.all(req.body.events.map(handleEvent));
    res.status(200).end();
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).end();
  }
});

async function handleEvent(event) {
  console.log("LINE EVENT:");
  console.log(JSON.stringify(event, null, 2));

  if (event.type !== "message") {
    return;
  }

  if (event.message.type !== "text") {
    return;
  }

  const groupId = event.source.groupId || "-";
  const userId = event.source.userId || "-";
  const timestamp = event.timestamp;
  const text = event.message.text;

  console.log("Group ID:", groupId);
  console.log("User ID:", userId);
  console.log("Timestamp:", timestamp);
  console.log("Text:", text);

  if (!event.replyToken) {
    return;
  }

  await client.replyMessage({
    replyToken: event.replyToken,
    messages: [
      {
        type: "text",
        text:
          `รับข้อความแล้ว ✅\n\n` +
          `ข้อความ: ${text}\n` +
          `Group ID: ${groupId}\n` +
          `User ID: ${userId}`
      }
    ]
  });
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
