
//  引入依赖包
let express = require('express');
let superagent = require('superagent');
let cheerio = require('cheerio');
let app = express();

app.get('/',function(req,res,next){
      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
      // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
      // 剩下就都是 jquery 的内容了
    superagent.get('https://cnodejs.org/').end(function(err,sres){
        if (err) return next(err);   //利用next中间件处理错误
        let $ = cheerio.load(sres.text);
        let items = [];
        $('#topic_list .topic_title').each(function (idx, element) {
            var $element = $(element);
            items.push({
              title: $element.attr('title'),
              href: $element.attr('href')
            });
          });

          $('#topic_list .user_avatar img').each(function (idx, element) {
            var $element = $(element);
            items[idx].author = $element.attr('title');
          });
    
          res.send(items);
    })
});

app.listen(3000,function(){
    console.log("正在监听3000端口");
})