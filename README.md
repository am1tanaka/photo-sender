# photo-sender
写真をコメント付きでメール送信する習作。

## クライアントサイド
- JavaScript+Bootstrapでページを構築
- 写真、コメント、撮影日時、撮影場所（とりあえずテキスト。将来的には地図上で指定可能にしたい）を設定
- ファイルはExpressのstaticで配信するのでejsで構築

## サーバーサイド
- Herokuでホスト
- Node.js+Express(ejs)で構築
- メール送信は http://sendgrid.com/ を利用
    - https://devcenter.heroku.com/articles/sendgrid

## 環境設定
ローカルは.env、Heroku上はコマンドで以下を定義する。
- MAILTO に送信先のメールアドレスを設定する
- CC にカーボンコピー先のメールアドレスが設定できる。空欄にするとCCを利用しない
- SENDGRID_USERNAME SendGridをインストールした時に生成されるユーザーネームを設定
- SENDGRID_PASSWORD SendGridをインストールした時に生成されるパスワードを設定

## アクセス
- HerokuのルートをGETするとメール送信用のフォーム表示
- submitするとPOSTで呼び出されるので送信処理
    - データを取り出す
    - メールを組み立てて設定の宛先に送信
    - 成功したら成功を表示
    - データをリセットしてトップページを再表示
    - エラーはフォームのエラー欄に表示

## 将来的な実装
いたずらが発生したら以下を実装する。利便性のため、しばらくは実装せずに様子を見る。
- いたずら防止のため、画像認証を通さないと機能しないようにする
    - [Google reCAPTCHA](https://www.google.com/recaptcha/intro/index.html)を利用 https://syncer.jp/how-to-introduction-recaptcha

# ライセンス
- MIT License

