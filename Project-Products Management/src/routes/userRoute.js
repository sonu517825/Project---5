const express = require("express")
const router = express.Router()
const { registerUser, loginUser, getUser, updateProfile, updatePassword,
    forgetPassword, resetPassword, logoutUser } = require("../controllers/userController")
const { authorization } = require("../middleware/authorization")
const { authentication } = require("../middleware/authuntication")




router.route("/register")
    .post(registerUser)


router.route("/login")
    .post(loginUser)


router.route("/user/:userId/profile")
    .get(authentication, getUser)
    .put(authentication, authorization, updateProfile)


router.route("/user/:userId/password/passwordupdate")
    .put(authentication, authorization, updatePassword)


router.route("/user/password/forgot")
    .put(forgetPassword)


router.route("/password/reset/:token")
    .put(resetPassword)


router.route("/user/:userId/logout")
    .get(logoutUser)



module.exports = router


