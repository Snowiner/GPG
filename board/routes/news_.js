var express = require('express');
var router = express.Router();
var User = require("../models/User");

var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var options = {
  url:'http://media.daum.net/breakingnews/digital',

};

router.get('/',function(req,res){

  request.get(options , function(err,res,html){
    var $ = cheerio.load(html);

  var data = $(".list_news2 list_allnews[0]").text();


      console.log(data);

  });

});



module.exports = router;