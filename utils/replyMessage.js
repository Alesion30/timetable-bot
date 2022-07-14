// LINE アクセストークン
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

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

module.exports = replyMessage;
