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

module.exports = {
    createAccountController
}