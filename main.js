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

// 次の授業情報を取得する関数
const getNextLesson = require("./utils/getNextLesson");

app.get("/timetable", (req, res) => {
  const date = new Date("2022-7-15 12:00:00");
  const lesson = getNextLesson(date);
  res.json(lesson);
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

    if (messageText !== undefined) {
      if (
        messageText.indexOf("次") !== -1 &&
        messageText.indexOf("授業") !== -1
      ) {
        const now = new Date();
        const lesson = getNextLesson(now);
        if (lesson !== null) {
          await replyMessage(`次の授業は、${lesson.name}です`, replyToken);
        } else {
          await replyMessage("次の授業はありません", replyToken);
        }
      } else {
        await replyMessage("すみません、よくわかりません", replyToken);
      }
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
