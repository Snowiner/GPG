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


                 data.forEach(function(data){

                   console.log(data);



               });




                //  res.render("news/result",{data:data});

                 //res.send(data);
             });
         });
     });
     req.end();

});
module.exports = router;
