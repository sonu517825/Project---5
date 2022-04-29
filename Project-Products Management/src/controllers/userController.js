const userModel = require("../models/userModel")
const validator = require("../validator/userValidator")
const awsConnection = require("../utils/awsConnection")
const encription = require("../utils/encryption")
const generateToken = require("../utils/generateToken")
const ResetPasswordToken = require("../utils/resetPassword")
const sendEmail = require("../utils/sendEmail")
const error = require("http-errors")
const sendSuccess = require("../utils/sender")
const catchAsyncError = require("../utils/catchAsyncErrors")
const crypto = require("crypto")




//********************************************************* Register User ********************************************************************//


const registerUser = catchAsyncError(async function (req, res, next) {


    if (validator.isValidRequestBody(req.query)) return next(error(405, 'req query not allowed'))
    const requestBody = req.body
    if (!validator.isValidRequestBody(requestBody)) return next(error(400, 'provide user data in req body'))
    const { fname, lname, email, phone, password } = requestBody


    if (!validator.isValidRequestValue(fname) || !validator.isStrictString(fname)) return next(error(400, 'provide valid first name'))
    if (!validator.isValidRequestValue(lname) || !validator.isStrictString(lname)) return next(error(400, 'provide valid last name'))
    if (!validator.isValidRequestValue(email) || !validator.isValidEmail(email)) return next(error(400, 'provide valid email'))



    const profileImage = await awsConnection.uploadProfileImage(req.files)
    if (!profileImage) return next(error('there is an error to upload profile image'))
    if (!validator.isValidRequestValue(phone) || !validator.isValidPhone(phone)) return next(error(400, 'please provide valid phone number'))


    if (!validator.isValidRequestValue(password) || !validator.isValidPassword(password)) return next(error(400, 'please provide 8 to 16 character password'))
    const encryptedPassword = await encription.setEncription(password)
    if (!encryptedPassword) return next(error('there is an error to set your password'))


    const finalSave = { fname, lname, email, phone, profileImage, password: encryptedPassword }
    const saveUserData = await userModel.create(finalSave)
    return sendSuccess(201, saveUserData, res)

})




//********************************************************* Login User ********************************************************************//




const loginUser = catchAsyncError(async function (req, res, next) {


    const requestBody = req.body
    if (validator.isValidRequestBody(req.query)) return next(error(405, 'req query not allowed'))
    if (!validator.isValidRequestBody(requestBody)) return next(error(400, 'provide login details'))


    const { email, password } = requestBody


    if (!validator.isValidRequestValue(email) || !validator.isValidEmail(email)) return next(error(400, 'provide valid email'))
    const user = await userModel.findOne({ email }).select('+password')
    if (!user) return next(error(404, 'no user found'))


    if (!validator.isValidRequestValue(password) || !validator.isValidPassword(password)) return next(error(400, 'please provide 8 to 16 character password'))
    const matchPassword = await encription.matchEncription(password, user.password)
    if (!matchPassword) return next(error(400, 'email or password not match'))


    const tokenWithId = await generateToken.generateToken(user)
    if (!tokenWithId) return next(error('there is an error to login'))


    res.setHeader('authorization', tokenWithId.token)
    console.log("Security details", tokenWithId)


    return res.status(200).cookie('token', tokenWithId.token, { expires: new Date(Date.now() + 60 * 60 * 1000), httpOnly: true }).send({ success: true, msg: `User login successfully`, data: tokenWithId })

})




//********************************************************* Get User ********************************************************************//




const getUser = catchAsyncError(async function (req, res, next) {


    if (validator.isValidRequestBody(req.query)) return next(error(405, 'req query not allowed'))
    if (validator.isValidRequestBody(req.body)) return next(error(405, 'req body not allowed'))


    const userData = await userModel.findById(req.params.userId)
    if (!userData) return next(error(404, 'no user found'))


    return sendSuccess(200, userData, res)

})




//********************************************************* Update User Profile ********************************************************************//




const updateProfile = catchAsyncError(async function (req, res, next) {


    if (validator.isValidRequestBody(req.query)) return next(error(405, 'req query not allowed'))
    const requestBody = req.body


    if (!validator.isValidRequestBody(req.body)) return next(error(400, 'please provide update data in req body'))
    let { fname, lname, email, phone, password } = requestBody


    if ('password' in req.body) return next(error(405, 'here password update not allow'))
    let updateUserData = {}


    if ('fname' in req.body) {

        if (!validator.isValidRequestValue(fname) || !validator.isStrictString(fname)) return next(error(400, " 'fname' You can pass only a to z OR A to Z."))
        if (!('$set' in updateUserData)) updateUserData["$set"] = {};
        updateUserData['$set']['fname'] = fname

    }


    if ('lname' in req.body) {

        if (!validator.isValidRequestValue(lname) || !validator.isStrictString(lname)) return next(error(400, "'lname' You can pass only a to z OR A to Z"))
        if (!('$set' in updateUserData)) updateUserData["$set"] = {};
        updateUserData['$set']['lname'] = lname

    }


    if ('email' in req.body) {

        if (!validator.isValidRequestValue(email) || !validator.isValidEmail(email)) return next(error(400, "'email' You can pass only a valid email."))
        let duplicateEmail = await userModel.findOne({ email: email })
        if (duplicateEmail) return next(error(405, `Email Already Present. Take another email`))
        if (!('$set' in updateUserData)) updateUserData["$set"] = {};
        updateUserData['$set']['email'] = email

    }


    if ('phone' in req.body) {

        if (!validator.isValidRequestValue(phone) || !validator.isValidPhone(phone)) return next(error(400, "'phone' You can pass only a valid Indian Mobile No."))
        let duplicatePhone = await userModel.findOne({ phone: phone })
        if (duplicatePhone) return next(error(405, `Phone Already Present. Take another Phone Number`))
        if (!('$set' in updateUserData)) updateUserData["$set"] = {};
        updateUserData['$set']['phone'] = phone

    }


    if (req.files && req.files.length > 0) {

        const profileImage = await awsConnection.uploadProfileImage(req.files)
        if (!profileImage) return next(error("there is an error to upload profile image."))
        if (!('$set' in updateUserData)) updateUserData["$set"] = {};
        updateUserData['$set']['profileImage'] = profileImage

    }


    console.log("updateUserData", updateUserData)
    const updatedData = await userModel.findOneAndUpdate({ _id: req.params.userId }, updateUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    return sendSuccess(200, updatedData, res)

})




//********************************************************* log out user ********************************************************************//




const logoutUser = catchAsyncError(async function (req, res, next) {


    if (validator.isValidRequestBody(req.query)) return next(error(405, 'req query not allowed'))
    if (validator.isValidRequestBody(req.body)) return next(error(405, 'req body not allowed'))


    return res.status(200).cookie('token', null, { expires: new Date(Date.now()), httpOnly: true }).send({ success: true, msg: 'logout' })

})




//********************************************************* forget password ********************************************************************//




const forgetPassword = catchAsyncError(async function (req, res, next) {


    if (validator.isValidRequestBody(req.query)) return next(error(405, 'req query not allow'))
   if (!validator.isValidRequestBody(req.body) || !validator.isValidRequestValue(req.body.email) || !validator.isValidEmail(req.body.email))
       return next(error(400, " please provide a valid 'email' in request body"))


    const user = await userModel.findOne({ email: req.body.email })
    if (!user) return next(error(404, "no user found"))


    const token = await ResetPasswordToken.PasswordToken()
    if (!token) return next(error('there is an error to reset your password'))


    console.log("forget password details : ", token)
    await userModel.findOneAndUpdate({ email: req.body.email },
        {
            '$set': {
                resetPasswordToken: token.cryptoResetPasswordToken,
                resetPasswordExpire: token.resetPasswordExpire
            }
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })


    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${token.resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it. \n\n Sender : SONU VERMA`;


    const mail = await sendEmail({ email: user.email, subject: `Ecommerce Password Recovery Mail`, message, });
    if (!mail) return next(error('there is an error to send password recovery mail'))
    return sendSuccess(200, `Reset Password email sent to  '${user.email}'  successfully.`, res)

})




//********************************************************* reset password ********************************************************************//




const resetPassword = catchAsyncError(async function (req, res, next) {


    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await userModel.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })
    if (!user) return next(error(400, "Reset Password Token is invalid or has been expired"))


    if (!validator.isValidRequestValue(req.body.newPassword) || !validator.isValidPassword(req.body.newPassword) || !validator.isValidRequestValue(req.body.confirmNewPassword) || !validator.isValidPassword(req.body.confirmNewPassword))
        return next(error(400, "please provide 'newPassword' and 'confirmNewPassword' in req body min 8 character"))
    if (req.body.newPassword !== req.body.confirmNewPassword) return next(error(400, 'password not match'))


    const encryptedPassword = await encription.setEncription(req.body.newPassword)
    if (!encryptedPassword) return next(error('there is an error to set your password'))


    await userModel.findOneAndUpdate({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    },
        {
            '$set': {
                resetPasswordToken: null,
                resetPasswordExpire: null,
                password: encryptedPassword
            }
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })
    return sendSuccess(200, `Your new password : '${req.body.newPassword}' `, res)

})




//********************************************************* update password ********************************************************************//




const updatePassword = catchAsyncError(async function (req, res, next) {


    if (validator.isValidRequestBody(req.query)) return next(error(405, 'req query not allowed'))
    if (!validator.isValidRequestValue(req.body.oldPassword) || !validator.isValidPassword(req.body.oldPassword) || !validator.isValidRequestBody(req.body)) 
    return next(error(400, "please provide 'oldPassword' in req body"))


    const matchPassword = await encription.matchEncription(req.body.oldPassword, req.user.password)
    if (!matchPassword) return next(error(400, 'old Password is incorrect'))


    if (!validator.isValidRequestValue(req.body.newPassword) || !validator.isValidPassword(req.body.newPassword) || !validator.isValidRequestValue(req.body.confirmNewPassword) || !validator.isValidPassword(req.body.confirmNewPassword))
        return next(error(400, "please provide 'newPassword' and 'confirmNewPassword' in req body min 8 character"))


    if (req.body.newPassword !== req.body.confirmNewPassword) return next(error(400, 'password not match'))


    const encryptedPassword = await encription.setEncription(req.body.newPassword)
    if (!encryptedPassword) return next(error('there is an error to set your password'))


    await userModel.findByIdAndUpdate(req.params.userId,
        {
            '$set': {
                password: encryptedPassword
            }
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })
    return sendSuccess(200, `Your new password : '${req.body.newPassword}' `, res)

})


module.exports = {
    registerUser,
    getUser,
    loginUser,
    updateProfile,
    logoutUser,
    forgetPassword,
    resetPassword,
    updatePassword
}

