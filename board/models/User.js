var mongoose = require("mongoose");

//schema
var userSchema = mongoose.Schema({
  username:{type:String, required:[true,"Username is required!"], unique:true},
  password:{type:String, required:[true,"Password is required!"], select:false},
  name:{type:String, required:[true,"Name is required!"]},
  email:{type:String}
},{
  toObject:{virtuals:true}
});

//virtuals //2. DB에 저장되는 값은 password인데, 회원가입, 정보 수정시에는 위 값들이 필요하다. DB에 저장되지 않아도 되는 정보들은 virtual로 만들어준다.
userSchema.virtual("passwordConfirmation")
.get(function(){ return this._passwordConfirmation; })
.set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual("originalPassword")
.get(function(){ return this._originalPassword; })
.set(function(value){ this._originalPassword=value; });

userSchema.virtual("currentPassword")
.get(function(){ return this._currentPassword; })
.set(function(value){ this._currentPassword=value; });

userSchema.virtual("newPassword")
.get(function(){ return this._newPassword; })
.set(function(value){ this._newPassword=value; });

// password validation //3. DB에 정보를 생성, 수정하기 전에 mongoose가 값이 유효(valid)한지 확인(validate)을 하게 되는데 password항목에 custom(사용자정의) validation 함수를 지정할 수 있다. virtual들은 직접 validation이 안되기 때문에(DB에 값을 저장하지 않기 때문) password에서 값을 확인하도록 했다.
userSchema.path("password").validate(function(v) {
  var user = this; //3-1. validation callback 함수 속에서 this는 user model이다.

  //create user //3-3. 회원가입의 경우 password confirmation값이 없는 경우, password와 password confirmation값이 다른 경우에 invalidate를 하게 된다.
  if(user.isNew){ //3-2. model.isNew항목이 true이면 새로 생긴 model 즉, 새로 생성되는 user이며, 값이 false이면 DB에서 읽어 온 model 즉, 회원정보를 수정하는 경우이다.
    if(!user.passwordConfirmation){
      user.invalidate("passwordConfirmation", "Password Confirmation is required!");
    }
    if(user.password !== user.passwordConfirmation) {
      user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
    }
  }

  //update user //3-4. 회원정보 수정의 경우 current password값이 없는 경우, current password값이 original password랑 다른 경우, new password와 password confirmation값이 다른 경우 invalidate.
  if(!user.isNew){
    if(!user.currentPassword){
      user.invalidate("currentPassword", "Current Password is required!");
    }
    if(user.currentPassword && user.currentPassword != user.originalPassword){
      user.invalidate("currentPassword", "Current Password is invalid!");
    }
    if(user.newPassword !== user.passwordConfirmation){
      user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
    }
  }
});

//model & export
var User = mongoose.model("user",userSchema);
module.exports = User;
