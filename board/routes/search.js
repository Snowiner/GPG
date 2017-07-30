var express = require("express");
var router = express.Router();
var Search = require("../models/Search");

//get search
router.get("/", function(req, res){
  var search_target = "";
  res.render("search/index",{
    search_target:search_target
  });
});

//post search
router.post("/", function(req,res){
  res.render("search/index",{
    search_target:req.body.search_target});
})

module.exports = router;