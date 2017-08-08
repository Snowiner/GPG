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

      console.log($);

  });

});



module.exports = router;
