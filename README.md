# photo-sender
写真をコメント付きでメール送信する習作。

## クライアントサイド
- JavaScript+Bootstrapでページを構築
- 写真、コメント、撮影日時、撮影場所（とりあえずテキスト。将来的には地図上で指定可能にしたい）を設定
- いたずら防止のため、画像認証を通さないと機能しないようにする
    - [Google reCAPTCHA](https://www.google.com/recaptcha/intro/index.html)を利用 https://syncer.jp/how-to-introduction-recaptcha
- ファイルはExpressのstaticで配信するのでejsで構築

## サーバーサイド
- Herokuでホスト
- Node.js+Express(ejs)で構築
- メール送信は http://sendgrid.com/ 
    - https://devcenter.heroku.com/articles/sendgrid

## アクセス
- HerokuのルートをGETするとメール送信用のフォーム表示
- submitするとPOSTで呼び出されるので送信処理
    - 画像認証
    - データを取り出す
    - メールを組み立てて設定の宛先に送信
    - 成功したら成功を表示
    - データをリセットしてトップページを再表示
    - エラーはアラート表示のみでフォームはそのまま

