const mongoose = require("mongoose");

const acccountSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"Account must be associated with the user"]
    },
    status:{
        enum:["ACTIVE","FROZEN","CLOSED"],
        message:"Status can be either ACTIVE,FROZEN or CLOSED"
    },
    currency:{
        type:String,
        required:[true,"Currency is required for creating an account"],
        default:"INR"
    },
    balance:{
        
    }
})