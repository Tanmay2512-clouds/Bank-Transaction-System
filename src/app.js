const express = require("express")
const authRouter = require("./routes/auth.routes")

const app = express()
app.use(express.json())
app.use("/api/auth",authRouter)//middleware created

module.exports = app;