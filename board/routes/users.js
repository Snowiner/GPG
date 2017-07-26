var express = require("express");
var router = express.Router();
var User = require("../models/User");

//Index //1
router.route("/").get(function(req, res){
  User.find({})
  .sort({username:1}) //sort는 username을 기준으로 내림차순한다.
  .exec(function(err, users){
    if(err) return res.json(err);
    res.render("users/index", {users:users});
  });
});

//New
router.get("/new", function(req, res){
  res.render("users/new", {user:{}});
});

//create
router.post("/", function(req, res){
  User.create(req.body, function(err, user){
    if(err) return res.json(err);
    res.redirect("/users");
  });
});

//show
router.get("/:username", function(req, res){
  User.findOne({username:req.params.username}, function(err, user){
    if(err) return res.json(err);
    res.render("users/show", {user:user});
  });
});

//edit
router.get("/:username/edit", function(req, res){
  User.findOne({username:req.params.username}, function(err, user){
    if(err) return res.json(err);
    res.render("users/edit", {user:user});
  });
});

//update //2
router.put("/:username", function(req, res, next){
  User.findOne({username:req.params.username})  //2-1
  .select("password") //2-2. select 함수를 이용하면 DB에서 어떤 항목을 선택할지 안할지 정할 수 있다.
  .exec(function(err, user){
    if(err) return res.json(err);

    //update user object
    user.originalPassword = user.password;
    user.password = req.body.newPassword? req.body.newPassword : user.password; //2-3
    for(var p in req.body){ //2-4. user은 DB에서 읽어온 data이고, req.body가 실제 form으로 입력된 값이므로 각 항목을 덮어 쓰는 부분이다.
      user[p] = req.body[p];
    }

    //save updated user
    user.save(function(err, user){
      if(err) return res.json(err);
      res.redirect("/users/"+req.params.username);
    });
  });
});

module.exports = router;
