const mongoose = require("mongoose");
const ledgerModel = require("./ledger.model")

const acccountSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"Account must be associated with the user"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["ACTIVE","FROZEN","CLOSED"],
            message:"Values can be either ACTIVE , FROZEN or CLOSED",
        }, default:"ACTIVE"
    },
    currency:{
        type:String,
        required:[true,"Currency is required for creating an account"],
        default:"INR"
    },
    
},{
    timestamps:true
})

acccountSchema.index({user:1,status:1}) //compound index

acccountSchema.methods.getBalance =  async function(){
    const balanceData = await ledgerModel.aggregate([
        {$match:{account:this._id}},
        {
            $group:{
                _id:null,
                totalDebit:{
                    $sum:{
                        $cond:[
                            {$eq :["$type","DEBIT"]},
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type","CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project:{
                _id:0,
                balance:{$subtract:["$totalCredit","$totalDebit"]}
            }
        }
    ])
    if(balanceData.length == 0){
        return 0
    }

    return balanceData[0].balance

}

const accountModel = mongoose.model("account",acccountSchema)

module.exports = accountModel