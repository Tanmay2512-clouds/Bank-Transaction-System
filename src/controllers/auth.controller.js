const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")
const tokenBlackListModel = require("../models/BlackList.model")

async function userRegisterController(req,res){
    const {email,password,name} = req.body

    const isExists = await userModel.findOne({
        email:email
    })

    if(isExists){
        return res.status(422).json({
            message:"This Email Already Exists",
            status:"failed"
        })
    }

    const user = await userModel.create({
        email , password , name 
    })

    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})

    res.cookie("token",token)

    res.status(201).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },token
    })

    await emailService.sendRegistrationEmail(user.email,user.name)

    
}

//user login controller /api/auth/login
async function userLoginController(req,res){
    const {email,password} = req.body

    //find user with the help of email

    const user = await userModel.findOne({email}).select("+password")
    //if user not found

    if(!user){
        return res.status(401).json({
            message:"Email or password is invalid"
        })
    }

    //if password is valid

    const isVaildPassword = await user.comparePassword(password)

    //if password is not vaild

    if(!isVaildPassword){
        return res.status(401).json({
            message:"Email or Password is Invalid"
        })
    }

    //when  password vaild then the data given is
    //the data is given in the form of token
    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})

    res.cookie("token",token)

    res.status(200).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },token
    })
}

async function userLogoutController(req,res){
    const token = req.cookies.token || req.headers.authorization?.split("")[1]
    if(!token){
        return res.status(200).json({
            message:"User logged out successfully"
        })
    }
    res.cookies("token","")

    await tokenBlackListModel.create({
        token:token
    })

    res.clearCookie("token")

    res.status(200).json({
        message:"User Logged Out SuccessFully"
    })
}

module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
}