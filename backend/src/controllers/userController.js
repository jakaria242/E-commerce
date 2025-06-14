import verifyEmailTemplate from "../mailTemplate/verifyEmailTemplate.js";
import { User } from "../models/userSchema.js";
import { ApiError } from "../utils/ApiError.js"
import {  ApiResponse } from "../utils/ApiResponse.js"
import { mail } from "../utils/sendMail.js";
import { cloudinaryUpload } from '../services/cloudinary.js'

 const emailpattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


 // token generator start =================================
const generateTokens = async (id) => {
    try {
      const user = await User.findById({ _id: id })
      const accessToken = await user.generateAccessToken()
      const refreshToken = await user.generateRefreshToken()
      // update user with refreshToken
      user.refreshToken = refreshToken
      await user.save()
      return { accessToken, refreshToken }
    } catch (error) {
      console.log('generateTokens error: ', error)
      return res.json(new ApiResponse(500, 'generateTokens error', { error: error.message }))
    }
  }
  // token generator end =================================



 // @desc create a user
// route POST /api/v1/user/registration
const createUser = async (req,res)=> {
try {
      const { displayName, email, password } = req.body;
      if (req.body.hasOwnProperty("displayName") && req.body.hasOwnProperty("email") && req.body.hasOwnProperty("password")) {

         if ([displayName, email, password].some((field) => field?.trim() === "")) {
      return res.json(new ApiError(400,"All fields are required"));
      }
        if(!emailpattern.test(email)){
        return res.json("Invalid email")
        }
      } else {
         return res.json(new ApiError(500,"invalid fields"));
      }

      const existingUser = await User.findOne({email})
      if (existingUser) {
         return res.json(new ApiError(400,"user alredy exist"));
      }

      const user = await User.create({displayName, email, password})
      const link = await user.generateAccessToken()
      await mail(user.email,"verification", 'Verify your mail',verifyEmailTemplate(link))

      return res.json(new ApiResponse(200, "user create sucessful", {user}));
      
      
} catch (error) {
    console.log("createUser error", error.message)
     return res.json(new ApiError(500, "Internal Server Erro", error.message));
}
}


// @desc User email verify
const emailVerify = async (req, res) => {
  try {
    const { link } = req.params
    const user = new User()
    const token = await user.verifyAccessToken(link)
    if (token) {
      const userFound = await User.findOne({ email: token.email })
      if (userFound) {
        if (userFound.emailVerified) {
          return res.json('Your email is all ready verified!')
        }
        userFound.emailVerified = new Date().toDateString()
        await userFound.save()
        return res.json('Your email has been verified!')
      } else {
        return res
          .status(400)
          .json(new ApiError(400, 'User verification failed!'))
      }
    } else {
      return res.status(400).json(new ApiError(400, 'Invalid verification url'))
    }
  } catch (error) {
    console.log('emailVerify error', error)
    return res
      .status(500)
      .json(new ApiError(500, 'emailVerify error', { error: error.message }))
  }
}


// @desc login a user
// route POST /api/v1/login
const login = async (req, res) => {
    try {
      const { email, password } = req.body
  
      // Check if email and password fields are provided
      if (
        req.body.hasOwnProperty('email') &&
        req.body.hasOwnProperty('password')
      ) {
        if ([email, password].some((field) => field?.trim() === '')) {
          return res.status(400).json( new ApiError(400, 'all fields are required', error.message))
        }
      } else {
        return res.status(400).json(new ApiError (400, 'invalid'))
      }
  
      // Find user by email
      const userFound = await User.findOne({ email })
      if (!userFound) {
        return res.status(400).json(new ApiError(400, 'email or pasword invalid'))
      }
  
      // Validate password
      const isPasswordCorrect = await userFound.isPasswordCorrect(password)
      if (!isPasswordCorrect) {
        return res.status(403).send('Email and Password are invalid')
      }

            // Check if the email is verified
            if (!userFound.emailVerified) {
              return res
                .status(403)
                .send('Email not verified. Please verify your email first.')
            }
  
  
    //   // Generate access and refresh tokens
      const { accessToken, refreshToken } = await generateTokens(userFound._id)
      
      return res.json(
        new ApiResponse(200, 'login successfull', {
          accessToken: accessToken,
          refreshToken: refreshToken,
        })
      )
    } catch (error) {
      console.log('login error', error)
      return res.json(new ApiResponse(500, 'login error', { error: error.message }))
    }
  }


  // @desc create a profileImage
// route POST /api/v1/user/update
const userUpdate = async (req, res) => {
  console.log(req.user, "44");
    try {
      // check file uploaded or not
      if (req.file) {
        const { path } = req.file
        const user = await User.findById(req.user._id)
        if (user) {
          const result = await cloudinaryUpload(
            path,
            user.displayName,
            'profileImage'
          )
  
          // cloudinaryImage.optimizeUrl || cloudinaryImage.uploadResult || cloudinaryImage.uploadResult.public_id
          user.profileImage = result.optimizeUrl
          user.publicId = result.uploadResult.public_id
          await user.save()
          return res.json(new ApiResponse(200, 'avatar uploded', { user }))
        }
      }
    } catch (error) {
      console.log('user update error', error)
      return res
        .status(500)
        .json(new ApiResponse(500, 'user update error', { error: error.message }))
    }
  }


  // @desc logout user
// route POST /api/v1/user/logout
const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    user.refreshToken = null
    await user.save()
    return res.status(200).json(new ApiResponse(200, 'logout successfull'))
  } catch (error) {
    console.log('logout error', error)
    return res
      .status(500)
      .json(new ApiResponse(500, 'logout error', { error: error.message }))
  }
}

export {
    createUser,
    emailVerify,
    login,
    userUpdate,
    logout
}