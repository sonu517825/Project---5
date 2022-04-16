const express = require("express")
const router = express.Router()
const cartController = require("../controllers/cartController")
const authuntication = require("../middlewear/authuntication")
const authorization = require("../middlewear/authorization")




router.post("/users/:userId/cart",
authuntication.authentication,
authorization.authorization,
cartController.addToCart )




router.put("/users/:userId/cart/reduceproduct",
authuntication.authentication,
authorization.authorization,
cartController.removeProductFromCart )




router.get("/users/:userId/cart",
authuntication.authentication,
authorization.authorization,
cartController.userCart )




router.delete("/users/:userId/cart",
authuntication.authentication,
authorization.authorization,
cartController.deleteUserCart )



module.exports = router



