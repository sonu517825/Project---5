const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const authorization = require("../middlewear/authorization")
const authuntication = require("../middlewear/authuntication")



router.get("/test-me", function (req , res){
    res.status(200).send("sonu first api")
})



router.post("/register" , userController.registerUser)



router.post("/login" , userController.loginUser)



router.get("/user/:userId/profile",authuntication.authentication,  userController.getUser)



router.put("/user/:userId/profile",authuntication.authentication,
authorization.authorization ,
userController.updateProfile)





module.exports = router



