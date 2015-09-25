var express = require('express');
var path = require('path');
var fs = require('fs');
var join = path.join;
var multer = require('multer'); // v1.0.5
var upload = multer({dest: 'uploads/',
  limits: {fields: 10,fileSize: 10000000,files: 1}
});
var gm = require('gm');
var imageMagick = gm.subClass({imageMatick: true});

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(imageMagick);
  res.render('index', { info: req.info, danger: req.danger });
});

/* POST home page. */
router.post('/', upload.single('filePhoto'), function(req,res,next) {
  // チェック
  console.log(req.body);
  console.log(req.file);
  if (!req.file) {
    res.render('index', {info:'', danger: '写真を設定してください。'});
    return;
  }
  var photo = req.file;
  var comment = req.body.report.comment || '';
  var place = req.body.report.place;
  if (place.length === 0) {
    res.render('index', {info: '', danger: '撮影場所を入力してください。'});
    return;
  }

  // メール
  var subject='多摩市の生き物報告';
  var body = comment+'\r\n\r\n場所：'+place+'\r\n[status pending][category 投稿]';
  var sendgrid  = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
  var sendparam =     {
      to:       process.env.SENDTO,
      from:     'tama-bioreserch-sysmas<yrk00337@nifty.com>',
      subject:  subject,
      text:     body,
      files: [
        {
          filename: photo.originalname,
          contentType: photo.mimetype,
          path: photo.path
        }
      ]
  };
  if (process.env.CC.length > 0) {
    sendparam.cc = process.env.CC;
  }
  sendgrid.send(sendparam, function(err, json) {
    // ファイルを削除
    fs.unlink(photo.path);
    //
    if (err) {
      res.render('index', {danger: err, info: ''});
      console.log(err);
      return;
    }

    console.log('send mail ok.');
    console.log(json);
    // 完了
    res.render('index', {info: '送信を完了しました。情報のご提供、ありがとうございます。引き続きご報告いただけます。', danger: ''});
  });
});

module.exports = router;
