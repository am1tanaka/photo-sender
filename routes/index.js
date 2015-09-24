var express = require('express');
var path = require('path');
var fs = require('fs');
var join = path.join;
var multer = require('multer'); // v1.0.5
var upload = multer({dest: 'uploads/',
  limits: {fields: 10,fileSize: 10000000,files: 1}
});

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
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
  sendgrid.send({
    to:       process.env.SENDTO,
    from:     'tama-bioreserch-sysmas<yrk00337@nifty.com>',
    subject:  subject,
    text:     body
  }, function(err, json) {
    if (err) {
      res.render('index', {danger: err, info: ''});
      console.log(err);
      return;
    }

    console.log(json);
  });

  // 完了
  res.render('index', {info: '送信を完了しました。情報のご提供、ありがとうございます。引き続きご報告いただけます。', danger: ''});
});

module.exports = router;
