const transactionModel = require("../models/transaction.model")
const LedegerModel = require("../models/ledger.model")
const emailService = require("../services/email.service")
const accountModel = require("../models/account.model")
const ledgerModel = require("../models/ledger.model")
const mongoose = require("mongoose")

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
        if(isTransactionAlreadyExists.status == "REVERSED"){
            return res.status(500).json({
                message:"Transaction was reversed previously , please retry"
            })
        }
    }

    if(fromUserAccount.status !== "ACTIVE"|| toUserAccount.status !=="ACTIVE"){
        return res.status(400).json({
            message:"Both fromAccount and toAccount must be ACTIVE to process transaction"
        })
    }

    const balance = await fromUserAccount.getBalance()

    if(balance<amount){
        return res.status(400).json({
            message:`Insufficient balance.Current balance is ${balance}.Requested
            amount is ${amount}`    
        })
    }
    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = await transactionModel.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    },{session})

    const debitLedgerEntry = await ledgerModel.create({
        account:fromAccount,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"
    },{session})

    const creditLedgerEntry = await ledgerModel.create({
        account:toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT"
    },{session})

    transaction.status = "COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    await emailService.sendTransactionEmail(req.user.email,req.user.name,amount,toAccount)

    res.status(201).json({
        message:"Transaction Completed Successfully"
    })


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

    let transaction
    try{

        const session =await mongoose.startSession()
        session.startTransaction()

        transaction = (await transactionModel.create([{
            fromAccount:fromAccount._id,
            toAccount,
            amount,
            idempotencyKey,
            status:"PENDING"
        }],{session}))[0]


        const debitLedgerEntry = await ledgerModel.create([{
            account:fromUserAccount._id,
            amount:amount,
            transaction:transaction._id,
            type:"DEBIT"

        }],{session})

        await (()=>{
            return new Promise((resolve)=>setTimeout(resolve,15*1000))
        })()

        const creditLedgerEntry = await ledgerModel.create([{
            account:toAccount,
            amount:amount,
            transaction:transaction_id,
            type:"CREDIT"
        }],{session})


        await transactionModel.findOneAndUpdate(
            {_id:transaction._id},
            {status:"COMPLETED"},
            {session}
        )

        await session.commitTransaction()
        session.endSession()
        
    }catch(error){
        return res.status(400).json({
            message:"Transaction is Pending due to some issue , please retry again after some time"
        })

    }

    return res.status(201).json({
        message:"Initial funds Transaction Completed Successfully",
        transaction:transaction
    })
}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}