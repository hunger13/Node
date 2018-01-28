let superagent = require('superagent');
let cheerio = require('cheerio');
let async = require('async');
let url = require('url');

//  先爬第一层 获取html数据
let cnodeUrl = 'https://cnodejs.org/';
let topicUrls = [];
superagent.get(cnodeUrl).end(function(err,res) {    //获取cnode首页title的数据
    console.log('开始扫描页面,获取页面信息');
    if(err) return console.error(err);
    let $ = cheerio.load(res.text); //获取页面html
    $('#topic_list .topic_title').each(function (idx, element) {
        var $element = $(element);
        var href = url.resolve(cnodeUrl, $element.attr('href'));
        topicUrls.push(href);
    });
    console.log('开始解析...');    
    async.mapLimit(topicUrls,5,function(url,callback) { //数组元素,回调
        console.log('正在解析' + url);
        superagent.get(url).end(function(err,res) {
            if (err) return console.log(err);
            let $ = cheerio.load(res.text);
            let info = {
                title: $('.topic_full_title').text().trim(),
                href: url,
                comment1: $('.reply_content').eq(0).text().trim(),
            }
            callback(null,info);
        });

    },function(err,result) {    //错误,结果
        if (err) return console.error(err);
        console.log('解析完毕');
        console.log(result);
    })
});

