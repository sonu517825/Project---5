const express = require("express")
const router = express.Router()
const { authorization } = require("../middleware/authorization")
const { authentication } = require("../middleware/authuntication")
const { newOrder } = require('../controllers/orderController')





router.route("/users/:userId/cart/order")
.post(authentication , authorization , newOrder)

module.exports = router




