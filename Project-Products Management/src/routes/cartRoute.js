const express = require("express")
const router = express.Router()
const { authorization } = require("../middleware/authorization")
const { authentication } = require("../middleware/authuntication")
const {addToCart, userCart, deleteUserCart, removeProductFromCart} = require("../controllers/cartController")





router.route("/users/:userId/cart")
.post(authentication , authorization , addToCart)
.get( authentication , authorization , userCart)
.delete(authentication , authorization , deleteUserCart)
.put(authentication , authorization , removeProductFromCart)




module.exports = router


















// const express = require("express")
// const router = express.Router()
// const cartController = require("../controllers/cartController")
// const authuntication = require("../middlewear/authuntication")
// const authorization = require("../middlewear/authorization")




// router.post("/users/:userId/cart",
// authuntication.authentication,
// authorization.authorization,
// cartController.addToCart )




// router.put("/users/:userId/cart",
// authuntication.authentication,
// authorization.authorization,
// cartController.removeProductFromCart )




// router.get("/users/:userId/cart",
// authuntication.authentication,
// authorization.authorization,
// cartController.userCart )




// router.delete("/users/:userId/cart",
// authuntication.authentication,
// authorization.authorization,
// cartController.deleteUserCart )




// module.exports = router



