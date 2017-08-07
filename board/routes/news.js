var express = require('express');
var router = express.Router();
var User = require("../models/User");


var https = require('https');
var querystring = require('querystring');
var parseString = require('xml2js').parseString;

router.get('/',function(req,res){
  res.render("news/search");
});



router.get('/result', function(req, res){

    if(req.query.userForm.length == 0){

      res.render("news/search");
    }
    var search = req.query.userForm;//검색어 부분.
    var queryOption = {'query':search, 'display':10, 'start':1, 'sort':'sim'};
    var query = querystring.stringify(queryOption);

    var client_id = 'wbHIytJgFJ4aTurrG62O';
    var client_secret = '69f5vyugTV';

    var host = 'openapi.naver.com';
    var port = 443;//??
    var uri ='/v1/search/news.xml?';

    var options = {
        host: host,
        port: port,
        path: uri + query,
        method: 'GET',
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };

    req = https.request(options, function(response) {
         console.log('STATUS: ' + res.statusCode);
         console.log('HEADERS: ' + JSON.stringify(res.headers));
         response.setEncoding('utf8');
         response.on('data', function (xml) {
             parseString(xml, function(err, result){
                 var data = JSON.stringify(result);


                // data.forEach(function(data){


                   var obj = JSON.parse(data);
                   var arr = obj.rss.channel[0].item;

                  //res.render("news/dummy",{data:arr});
                  //console.log(arr);
                  //console.log(arr[0].originallink[0]);
                  res.render("news/result",{data:arr});
                  //res.send(arr[0].title[0]);
                 //res.send(arr);
             });
         });
     });
     req.end();

});
module.exports = router;
