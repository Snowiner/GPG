var express = require('express');
var router = express.Router();
var User = require("../models/User");

var cheerio = require('cheerio');
var request = require('request');

var url = 'http://media.daum.net/breakingnews/digital';




router.get('/',function(req,ress){





request( url , function( err , response, html){


  var link = [];
  var title = [];
  var des = [];
  var img = [];


  if( err ){ throw err };

  var $ = cheerio.load(html);
  var arr = $('.cont_thumb .tit_thumb > a').length;
  var arr_ = $('.desc_thumb').length;



  $('.cont_thumb .tit_thumb > a').each(function( i , elem){
    link[i] = $(this).attr("href");
    title[i] = $(this).text();
  })
$('.cont_thumb .desc_thumb').each(function( i , elem){
  des[i] = $(this).text();
})


  //
  // $('.tit_thumb').forEach(function(data){
  //   console.log(  data('.link_txt').attr("href"));
  // });
  // var tmp = [];
  //s
  // $('.cont_thumb').each(function( i , elem){
  //   tmp[i].title = $(this).(' .tit_thumb').text();
  //   tmp[i].link = $(this).(' .tit_thumb > a').attr("href");
  //   tmp[i].des = $(this).(' .desc_thumb').text();
  // })

   ress.render("news/news_",{link:link,title:title,des:des});




})
// ress.render("news/news_",{link:link,title:title,des:des});

});



module.exports = router;
