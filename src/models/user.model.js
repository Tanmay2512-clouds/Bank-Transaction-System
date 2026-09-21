const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required for creating a user"],
        trim:true,
        lowercase:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/],
        unique:[true,"Email Already exists"]
    },
    name:{
        type:String,
        required:[true,"Name is Required for this account"]
    },
    password:{
        type:String,
        required:[true,"Password is required for creating the "],
        minlength:[6,"Password should constain atleast 6 character"],
        select:false
    },
},{
    timestamps:true
})