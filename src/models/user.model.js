const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

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

userSchema.pre("save",async function (next){
    if(!this.isModified("password")){ //if password is not modified
        return next()
    }
    //if password is modified then

    const hash = await bcrypt.hash(this.password,10) //Password converted to hash
    this.password = hash //password saved in hash
    return next()

})

//Now we have created this to compare my passwords
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password) // will return true or false by comparing the passwords
}

const userModel = mongoose.model("user",userSchema)

module.exports = userModel;