var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var express = require('express');
var app = express();

var cnodeUrl = 'https://cnodejs.org/';

superagent.get(cnodeUrl)
    .end(function (err, res, req) {
        if (err) {
            return console.error(err);
        }
        var topicUrls = [];
        var $ = cheerio.load(res.text);
        $('#topic_list .topic_title').each(function (idx, element) {
            if (idx < 10) {
                var $element = $(element);
                var href = url.resolve(cnodeUrl, $element.attr('href'));
                topicUrls.push(href);
            }
        });

        var ep = new eventproxy();
        topicUrls.forEach(function (topicUrl) {
            superagent.get(topicUrl)
                .end(function (err, res) {
                    console.log('fetch ' + topicUrl + ' successful');
                    let $ = cheerio.load(res.text);
                    let author1 = $('.user_info .reply_author').eq(0).text().trim();
                    let user_url = url.resolve(cnodeUrl + 'user/', author1);
                    let topic = {
                        title: $('.topic_full_title').text().trim(),
                        href: topicUrl,
                        comment1: $('.reply_content').eq(0).text().trim(),
                        author1: $('.user_info .reply_author').eq(0).text().trim(),
                    }
                    superagent.get(user_url).end(function (err, res) {
                        ep.emit('topic_html', [topic, res.text]);

                    })

                });
        });

        ep.after('topic_html', topicUrls.length, function (topics) {
            topics = topics.map(function(pair){
                let topic = pair[0];
                let user_html = pair[1];
                let $ = cheerio.load(user_html);

                score1 = $('.unstyled .big').eq(0).text().trim();
                topic.score1 = score1;
                return topic;
            });

            console.log('final:');
            console.log(topics);

        });


    });