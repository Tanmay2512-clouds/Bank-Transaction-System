const userModel = require("../models/user.model")

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
}

module.exports = {
    userRegisterController
}