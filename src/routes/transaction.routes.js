const {Router} = require('express')
const  authMiddleware  = require('../middleware/auth.middleware')
const transactionController = require('../controllers/transaction.controller')
const { authSystemUserMiddleware} = require('../middleware/auth.middleware')

const transactionRoutes = Router()

//Post api and /api/transaction

transactionRoutes.post("/",authMiddleware.authMiddleware,transactionController.createTransaction)

transactionRoutes.post("/system/initial-funds",authMiddleware.authSystemUserMiddleware,transactionController.createInitialfundsTransaction)


module.exports = transactionRoutes