const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

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

    
}

module.exports = {
    userRegisterController
}