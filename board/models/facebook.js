var mongoose = require("mongoose");

var fuserSchema = mongoose.Schema({
  id:{
    type:String,
    required:[true,"Username is required!"],
    trim:true,
    unique:true
  },
  token:{
   type:String
  },
  name:{
   type:String,
   trim:true
 },
 email:{
   type:String,
   trim:true
 }

},{
 toObject:{virtuals:true}
});

var fUser = mongoose.model("fuser",fuserSchema);
module.exports = fUser;
