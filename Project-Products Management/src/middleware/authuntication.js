const error = require("http-errors")
const jwt = require("jsonwebtoken")
const catchAsyncErrors = require("../utils/catchAsyncErrors")


const authentication = catchAsyncErrors(async function (req, res, next) {


    if (!req.cookies.token) return next(error(401, "please login again"))

    jwt.verify(req.cookies.token, process.env.SECRET_KEY, function (err, decode) {
        if (err) return next(error(401, err.message))
        console.log("verify token ", decode)
        req.decodedToken = decode
    });

    next()

})




module.exports.authentication = authentication




















// const createError = require("http-errors")
// const jwt = require('jsonwebtoken')




// const authentication = async function (req, res, next) {
//     try {
//         let token = req.headers["authorization"]

//         if (!token) return next(createError(404, "please provide token in request hadder in form of Bearear token "))
//         //if (!token.startsWith("Bearer")) return res.status(400).send({ status: false, msg: "please provide token in request hadder in form of Bearear token " })


//         token = token.split("Bearer")
//         token = token[1].trim()


//         let validateToken = jwt.verify(token, process.env.SECRET_KEY)
//         console.log("verify token ", validateToken)


//         req.decodedToken = validateToken


//         next()

//     } catch (err) {

//         console.log(err)


//         if (err.message.includes("secret or public key")) return next(createError(400, "authentication failed May be your secret key not present"))
//         if (err.message == "invalid token") return next(createError(400, "authentication failed May be your header part currupt"))
//         if (err.message.startsWith("Unexpected")) return next(createError(400, "authentication failed May be your payload part currupt"))
//         if (err.message == "invalid signature") return next(createError(400, "authentication failed May be your signature part currupt"))
//         if (err.message == "jwt expired") return next(createError(400, "authentication failed May be your token is expaired"))


//         return next(createError(err))
//         // priority wise error catch if any space present in anywhere at token catch only hadder part


//     }

// }




// module.exports.authentication = authentication


















