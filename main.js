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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const spring1 = require("./data/spring1.json");

app.get("/timetable", (req, res) => {
  res.json(spring1);
});

// 返信する関数
const replyMessage = require("./utils/replyMessage");

// LINE Webhook
app.post("/webhook", async (req, res) => {
  const events = req?.body?.events;
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
