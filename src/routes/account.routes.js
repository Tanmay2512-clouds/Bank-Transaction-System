const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const accountController = require("../controllers/account.controller")

const router = express.Router()

//We will create API here post method
//  /api/accounts/ (create a new account and protected routed)

router.post("/",authMiddleware.authMiddleware,accountController.createAccountController)

//get api

router.get("/",authMiddleware.authMiddleware,accountController.getUserAccountController)



module.exports = router