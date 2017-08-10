var express = require('express');
var router = express.Router();
var User = require("../models/User");

var cheerio = require('cheerio');
var request = require('request');

var async = require('async');
var url = 'http://media.daum.net/breakingnews/digital';




router.get('/',function(req,ress){





request( url , function( err , response, html){


  var link = [];
  var title = [];
  var des = [];
  var img = [];


  if( err ){ throw err };

  var $ = cheerio.load(html);



  $('.cont_thumb .tit_thumb > a').each(function( i , elem){
    link[i] = $(this).attr("href");
    title[i] = $(this).text();
  })
 $('.cont_thumb .desc_thumb').each(function( i , elem){
  des[i] = $(this).text();
})

$('img').each(function( i , elem){
  img[i] = $(this).attr("src")
})
//
//  var tasks =
//  [
//    function(callback)
//    {
//
//     link.forEach( function ( link ){
//           request( link , function( err , response, html)
//           {
//
//             var $$ = cheerio.load(html);
//             console.log(link.length);
//             img.push( $$('.link_figure > img').attr("src")  );
//             if( img.length == 17){
//               callback();
//             }
//
//           });
//
//       });
//
//
//     },
//     function(callback)
//     {
//         ress.render("news/news_",{link:link,title:title,des:des,img:img});
//     }
//  ];
//
// async.series(tasks, function (err, results) {
//     console.log(results);
//
// });
   ress.render("news/news_",{link:link,title:title,des:des,img:img});




})

});



module.exports = router;
