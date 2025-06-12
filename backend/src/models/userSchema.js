import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    displayName: {
        type: String,
        required: [true, "name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique:true,
        trim: true,
        lowerCase: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [6, "minium length is 6"],
        trim: true,
    },
    userName: {
        type: String,
        unique:true,
        trim: true,
        lowerCase: true
    },
    phoneNumber: {
        type: String,
        unique:true,
        trim: true
    },
    profileImage: {
        type: String,
    },
    publicId:{
        type: String,
    },
    emailVerified: {
        type: Date,
    },
    resetPasswordToken:{
        type: String,
    },
    role: {
        type: String,
        enum: ["user", "seller", "admin", "editor"],
        default: "user",
        lowerCase: true
    },
    dateOfBirth: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    adress: [
        {
            street:{
                type: String
            }
        },
        {
            postalCode:{
                type: String
            }
        },
        {
            district:{
                type: String
            }
        },
        {
            country:{
            type: String
        }}
    ]

}, { timestamps: true })


// hash password start ================================
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
        next()
    } else {
        return next()
    }
})
// hash password end ================================

// password chackmethods start ================================
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);

}
// password chackmethods end ================================

// generate accessToken and refreshToken start ===============================
userSchema.methods.generateAccessToken =  function () {
    return jwt.sign({ _id:this._id, displayName:this.displayName, email:this.email, role:this.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY});
     
}


userSchema.methods.generateRefreshToken =  function () {
    return jwt.sign({ _id:this._id, email:this.email, role:this.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY});
    
}
// generate accessToken and refreshToken end ===============================

// jwt token verification start ============================
userSchema.methods.verifyAccessToken = async function (token) {
  return jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, decoded) {
      if (err) {
        return null
      }
      return decoded
    }
  )
}


// jwt token verification end ============================

export const User = mongoose.model.User ?? mongoose.model("User",userSchema)