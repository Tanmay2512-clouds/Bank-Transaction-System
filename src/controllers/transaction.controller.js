const transactionModel = require("../models/transaction.model")
const LedegerModel = require("../models/ledger.model")
const emailService = require("../services/email.service")
const accountModel = require("../models/account.model")
const ledgerModel = require("../models/ledger.model")

async function createTransaction(req,res){
    const {fromAccount , toAccount , amount , idempotencyKey} = req.body
    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"All 4 field must be filled"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id:fromAccount
    })

    const toUserAccount = await accountModel.findOne({
        _id:toAccount
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message:"Invaild fields"
        })
    }

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey:idempotencyKey   
    })

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status == "COMPLETED"){
            return res.status(200).json({
                message:"Transaction Already Completed",
                transaction:isTransactionAlreadyExists
            })
        }
        if(isTransactionAlreadyExists.status == "PENDING"){
            return res.status(200).json({
                message:"Transaction is still in processing"
            })
        }
        if(isTransactionAlreadyExists.status == "FAILED"){
            return res.status(500).json({
                message:"Transaction process failed previously ,please retry"
            })
        }
    }
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

    const transaction = new transactionModel({
        fromAccount:fromAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account:fromUserAccount._id,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"

    }],{session})

    const creditLedgerEntry = await ledgerModel.create([{
        account:toAccount,
        amount:amount,
        transaction:transaction_id,
        type:"CREDIT"
    }],{session})

    transaction.status = "COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message:"Initial funds Transaction Completed Successfully",
        transaction:transaction
    })
}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}