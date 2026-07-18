const express = require("express");
const line = require("@line/bot-sdk");

const app = express();

const config = {
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
};

// หน้าเช็กว่า Server ยังทำงานอยู่
app.get("/", (req, res) => {
  res.status(200).send("LINE Summary Bot is running");
});

// จุดรับ Webhook จาก LINE
app.post("/webhook/line", line.middleware(config), async (req, res) => {
  try {
    for (const event of req.body.events) {
      console.log("LINE EVENT:");
      console.log(JSON.stringify(event, null, 2));

      if (event.source) {
        console.log("Group ID:", event.source.groupId || "-");
        console.log("User ID:", event.source.userId || "-");
        console.log("Timestamp:", event.timestamp || "-");
      }
    }

    res.status(200).end();
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).end();
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
