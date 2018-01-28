let express = require('express');   //引入express
let utility = require('utility');   //引入加密模块

let app = express();
app.get('/',function(req,res){
// 从 req.query 中取出我们的 q 参数。
  // 如果是 post 传来的 body 数据，则是在 req.body 里面，不过 express 默认不处理 body 中的信息，需要引入 https://github.com/expressjs/body-parser 这个中间件才会处理，这个后面会讲到。
  // 如果分不清什么是 query，什么是 body 的话，那就需要补一下 http 的知识了
    let q = req.query.q;
    if (q) {
        let md5Value = utility.md5(q);
        let sha1Value = utility.sha1(q);
        res.send(`md5 = ${md5Value} , sha1 = ${sha1Value} `);
    } else {
        res.send('没有获取到q的数据');
    }

});
//  监听3000端口
app.listen(process.env.PORT || 3000,function(req,res){
    console.log('app is listening at port 3000');
});