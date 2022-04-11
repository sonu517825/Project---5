const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")




router.get("/test-me", function (req , res){
    res.status(200).send("sonu first api")
})



router.post("/register" , userController.registerUser)



router.get("/user/:userId/profile",userController.getUser)


module.exports = router



