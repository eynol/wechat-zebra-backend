var WechatAPI = require('wechat-api');
var SECRET = require('./secret.json');

var api = new WechatAPI(SECRET.appid, SECRET.appsecret);
var menu = {
  "button": [
    {
      "type": "click",
      "name": "今日歌曲",
      "key": "V1001_TODAY_MUSIC"
    }, {
      "name": "菜单",
      "sub_button": [
        {
          "type": "view",
          "name": "搜索",
          "url": "http://www.soso.com/"
        }, {
          "type": "click",
          "name": "赞一下我们",
          "key": "V1001_GOOD"
        }
      ]
    }
  ]
};
// api.createMenu(menu, function(err,result){
//   console.log(err,result);
// });

api.getMenu( function(err,result){
  console.log(result);
  console.log(result.menu.button);
});

