const {Router} = require('express')
const { authMiddleware } = require('../middleware/auth.middleware')
const { authSystemUserMiddleware} = require('../middleware/auth.middleware')

const transactionRoutes = Router()

//Post api and /api/transaction

transactionRoutes.post("/",authMiddleware.authMiddleware,transactionController.createTransaction)

transactionRoutes.post("/system/initial-funds",authMiddleware.authSystemUserMiddleware,transactionController.createInitialTransaction)


module.exports = transactionRoutes