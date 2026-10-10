const transactionModel = require("../models/transaction.model")
const LedegerModel = require("../models/ledger.model")
const emailService = require("../services/email.service")
const accountModel = require("../models/account.model")
const ledgerModel = require("../models/ledger.model")

async function createTransaction(req,res){
    const {fromAccount , toAccount , amount , idempotencyKey} = req.body  
}

async function createInitialFundsTransaction(req,res){
    const {toAccount,amount,idempotencyKey} = req.body

    if(!toAccount|| !amount || !idempotencyKey){
        return res.status(400).json({
            message:"toAccount , amount and idempotencyKey are required"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id:toAccount
    })

    if(!toUserAccount){
        return res.status(400).json({
            message:"Invalid toAccount"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        systemUser:true,
        user:req.user._id
    })

    if(!fromUserAccount){
        return res.status(400).json({
            message:"System user account not found"
        })
    }

    const session =await mongoose.startSession()
    session.startTransaction()

    const transaction = await transactionModel.create({
        fromAccount:fromAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    },{session})

    const debitLedgerEntry = await ledgerModel.create({
        
    })
}

module.exports = {
    createTransaction
}