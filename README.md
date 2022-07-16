# TIMETABLE LINE Bot

```sh
$ node -v
v16.13.0

$ npm -v
8.1.0
```

## 環境構築

```sh
npm install
```

## 開発方法

```sh
node main.js
```

もしくは

```sh
nodemon main.js
```

http://localhost:3000 にアクセスすると、「Hello World」が表示されます。

localhostを外部公開するために、別のターミナルで ngrok を実行します。

```sh
ngrok http 3000
```

https://xxxx.ngrok.io にアクセスすると、「Hello World」が表示されます。

LINE Developers Console の Webhook URL に https://xxxx.ngrok.io/webhook を登録します。

## デプロイ

```sh
git push heroku main -f
```
