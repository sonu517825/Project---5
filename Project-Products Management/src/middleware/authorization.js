const userModel = require("../models/userModel")
const error = require("http-errors")
const catchAsyncError = require("../utils/catchAsyncErrors")


const authorization = catchAsyncError(async function (req, res, next) {

        let isPresentUser = await userModel.findById(req.params.userId).select('+password')
        if (!isPresentUser) return next(error(400, 'user not found'))
        if (req.params.userId != req.decodedToken.userId) return next(error(401, `unauthorize axcess`))
        req.user = isPresentUser
        next()

})



module.exports.authorization = authorization


