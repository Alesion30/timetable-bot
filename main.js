const express = require("express");
const app = express();
require("dotenv").config();

// ミドルウェア
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// LINE アクセストークン
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// LINE Webhook
app.post("/webhook", async (req, res) => {
  const events = req?.body?.events
  if (events.length > 0) {
    console.log(events[0].message);
    const messageText = events[0].message?.text;
    const replyToken = events[0].replyToken;

    // オウム返しする（送られてきたメッセージをそのまま返す）
    if (messageText !== undefined) {
      await replyMessage(messageText, replyToken);
    }
  }

  res.send("HTTP POST request sent to the webhook URL!");
});

// 返信する関数
const replyMessage = async (text, replyToken) => {
  const message = {
    type: "text",
    text: text,
  };

  // LINEサーバーに送るデータ
  const postData = {
    replyToken: replyToken,
    messages: [message],
  };

  // LINEサーバーにデータを送信
  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    body: JSON.stringify(postData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
    },
  });
};

// 住所を取得する
app.get("/address", async (req, res) => {
  const { zipcode } = req.query;
  if (zipcode !== undefined) {
    try {
      const data = await fetch(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`
      );
      const json = await data.json();
      const { address1, address2, address3 } = json.results[0];
      res.send(`${address1}${address2}${address3}`);
    } catch (err) {
      res.status(500).send(err.message);
    }
  } else {
    res.status(404).send("zipcodeを指定してください");
  }
});

app.listen(3000, () => {
  console.log("Running at http://localhost:3000");
});
