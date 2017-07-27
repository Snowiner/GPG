var express = require("express");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var app = express();

//DB setting
mongoose.connect(`mongodb://admin:1qkqtkd1@ds157712.mlab.com:57712/yelindata`, { useMongoClient: true });
var db = mongoose.connection;
db.once("open", function(){
  console.log("DB connected");
});
db.on("error", function(err){
  console.log("DB ERROR : ", err);
});

//Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//routes
app.use("/", require("./routes/home"));
app.use("/posts", require("./routes/posts"));
app.use("/users", require("./routes/users"));

//Port setting
app.listen(3000, function(){
  console.log("server on!");
});
