var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var SECRET = require('./secret.json');
var WechatAPI = require('wechat-api');

var wechat = require('wechat');
var config = {
  token: SECRET.token,
  appid: SECRET.appid,
  //encodingAESKey: SECRET.encodingAESKey,
  checkSignature: flase // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.query());
app.use('/wechat', wechat(config, function (req, res, next) {
  // 微信输入信息都在req.weixin上
  var message = req.weixin;
  if (message.MsgType == "text") {
    var input = message.Content.trim();
    if(input ==="网址"){
      res.reply({type: "text", content: 'http://baidu.com'});
    }else if(input === "天气"){
       res.reply({type: "text", content: '今天晴转阴'});
    }else{
      res.reply({content: '"你发送的是文本消息"', type: 'text'});
    }
  } else if (message.MsgType == "image") {
    res.reply({content: '"你发送的是图片消息"', type: 'text'});
  } else if (message.MsgType == "voice") {
    res.reply({content: '"你发送的是语音消息"', type: 'text'});
  } else if (message.MsgType == 'event') {

    if (message.Event === 'subscribe') {
      // 用户添加时候的消息
      res.reply('谢谢添加测试帐号:) ');
    } else if (message.Event === 'unsubscribe') {
      res.reply('Bye!');
    } else if(message.Event ==='click'){
      if(message.EventKey ==='V1001_TODAY_MUSIC'){
        // res.reply('谢谢点赞~');
        res.reply([
      {
        title: '北京欢迎你',
        description: '描述信息',
        picurl: 'http://wxtest.heitaov.cn/pic1.jpg',
        url: 'http://baidu.com'
      }
    ,
      {
        title: '千里之外',
        description: '描述信息',
        picurl: 'http://wxtest.heitaov.cn/pic1.jpg',
        url: 'http://baidu.com'
      }
    ])
      }else if(message.EventKey  ==='V1001_GOOD'){
          res.reply('谢谢点赞~');
      }else{
         res.reply('未知菜单');
      }
    }else{
      res.reply('暂未支持! Coming soon!');
    }

  }

}));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req
    .app
    .get('env') === 'development'
    ? err
    : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
