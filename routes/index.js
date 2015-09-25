var express = require('express');
var path = require('path');
var fs = require('fs');
var join = path.join;
var ExifImage = require('exif').ExifImage;
var multer = require('multer'); // v1.0.5
var upload = multer({dest: 'uploads/',
  limits: {fields: 10,fileSize: 10000000,files: 1}
});
var gm = require('gm');
var imageMagick = gm.subClass({imageMagick: true});

var router = express.Router();

/** 最大サイズ*/
var WIDTH_MAX = 1024;
var HEIGHT_MAX = 768;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { info: req.info, danger: req.danger });
});

/** 画像テスト。完了したら終了*/
router.post('/', upload.single('filePhoto'), function(req,res,next) {
  var photo = req.file;

  // ファイル名を戻す
  var photopath = join(__dirname, '../uploads', photo.originalname);
  var ext = path.extname(photo.originalname);
  var destpath = join(__dirname, '../uploads', path.basename(photo.originalname, ext)+"_out"+ext);
  fs.rename(photo.path, photopath, function(err) {
    if (err)  return next(err);

    console.log('file:'+photopath);

    // EXIFテスト
    new ExifImage({image: photopath}, function(err, exifData) {
      if (err)  return next(err);
      console.log("exif="+exifData);

      // その後の処理
      // 画像縮小
      var datas = [];
      var base = imageMagick(photopath)
        .resize(WIDTH_MAX, HEIGHT_MAX)

        .write(destpath, function(err) {
          if (err) {console.log(err);return next(err);}

          console.log('convert done.');
          fs.unlink(photopath);
          res.render('index', {info: '画像テスト', danger: ''});
        });
    });
  });


    /*
    .stream('jpg', function(err, stdout, stderr) {
      if (err) {
        // ファイルを削除
        console.log("error:"+err);
        fs.unlink(photopath);
        return next(err);
      }
      // 読み込みイベントを設定
      stdout.on('data', function(chunk) {
        datas.push(chunk);
        console.log(chunk.length);
      }).on('end', function (chunk) {
        if (chunk) {datas.push(chunk);}

        // データを結合する
        var sz = 0;
        for (var i=0 ; i<datas.length ; i++) {
          sz += datas[i].length;
        }
        console.log('size='+sz);
        var img = new Buffer(sz);
        var offset = 0;
        for (i=0 ; i<datas.length ; offset+=datas[i].length,i++) {
          datas[i].copy(img, offset);
        }

        // ファイルを削除
        fs.unlink(photopath);

        //res.render('index', {info: 'データサイズ:'+img.length, danger: ''});
        // 吐き出しが終わったので、出力
        res.setHeader('Expires', new Date(Date.now() + 604800000));
        res.setHeader('Content-Type', 'image/jpg');
        res.send(img);
      });
    });
    */
});

/* POST home page. */
router.post('/commentout', upload.single('filePhoto'), function(req,res,next) {
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

  // 画像縮小
  var img = imageMagick(photo.path);
  console.log('img='+img);
  console.log('size='+img.size());

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
