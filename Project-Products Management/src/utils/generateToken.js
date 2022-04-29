const jwt = require("jsonwebtoken")



const generateToken = async function (user) {
    try {

        
        var token = await jwt.sign(
            { userId: user._id, name: process.env.NAME },
            process.env.SECRET_KEY,
            { expiresIn: process.env.TOKEN_EXPIRE }
        )


        token = {
            userId: user._id,
            token: token
        }
        return token

    }
    catch (err) {
        console.log(err)
    }
}


module.exports.generateToken = generateToken

