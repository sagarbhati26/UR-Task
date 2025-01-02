import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    fullName:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        required:[true,'Password is required']
    },
    refreshToken:{
        type: String
    },
    role:{
        type:String,
        enum:['manager','employee'],
        required:[true,'Role is required']
    }
})

userSchema.pre("save",async function (next) {
    if(!this.isModified("password"))
        return next()
   this.password= await bcrypt.hash(this.password,10)
   next()
    
})

userSchema.methods.isPasswordCorrect=async function(password) {
 return await bcrypt.compare(password,this.password)   
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
      {
        _id: this._id,role:this.role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
  };
  userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
      { _id: this._id, role: this.role }, // Include essential details in the token
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
  };
  
  
 
export const User = mongoose.model("User", userSchema);
