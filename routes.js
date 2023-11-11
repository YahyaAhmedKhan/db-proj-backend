const express = require('express')
const router = express.Router()
const accountRoutes = require('./routes/accounts.js')

router.use('/accounts', accountRoutes)

module.exports = router
