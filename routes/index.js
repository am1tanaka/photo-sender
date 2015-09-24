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
  res.render('index', { message: req.message });
});

/* POST home page. */
router.post('/', upload.single('filePhoto'), function(req,res,next) {
  // チェック
  console.log(req.body);
  console.log(req.file);
  if (!req.file) {
    res.render('index', {message: '写真を設定してください。'});
    return;
  }
  var photo = req.files.report.photo;
  var comment = req.body.report.comment;
  var place = req.body.report.place;
  if (place.length == 0) {
    res.render('index', {message: '撮影場所を入力してください。'});
    return;
  }

  // メール
});

module.exports = router;
