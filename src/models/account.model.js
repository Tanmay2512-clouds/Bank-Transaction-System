const mongoose = require("mongoose");

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

const accountModel = mongoose.model("account",acccountSchema)

module.exports = accountModel