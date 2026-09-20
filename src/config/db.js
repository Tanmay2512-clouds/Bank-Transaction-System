const mongoose = require("mongoose")

async function connecTotDB() {
    await mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("Server is connected")
        })
        .catch(err=>{
            console.log("Server is connected to DB")
            process.exit(1)
        })
    
}

module.exports = connecTotDB

