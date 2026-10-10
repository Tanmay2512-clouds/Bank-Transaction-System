const accountModel = require("../models/account.model")
const userModel = require("../models/user.model")

async function createAccountController(req,res){
    const user = req.user

    const account = userModel.create({
        user:user._id
    })

    res.status(201).json({
        account
    })
}

async function getUserAccountController(req,res){
    const accounts = await accountModel.find({user:req.user._id})

    res.status(200).json({
        accounts
    })
}

module.exports = {
    createAccountController,    
    getUserAccountController
}