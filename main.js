const express = require("express");
const app = express();
require('dotenv').config();

// ミドルウェア
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// LINE Webhook
app.post("/webhook", async (req, res) => {
  console.log(req?.body?.events[0].message)
  res.send("HTTP POST request sent to the webhook URL!")
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
