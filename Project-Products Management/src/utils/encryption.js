const bcrypt = require("bcryptjs")


const setEncription = async function (password) {
    try {

        password = password.trim()
        const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))
        console.log("encriptedPassword : ", passwordHash)
        return passwordHash

    }
    catch (err) {
        console.log(err)
    }

}



const matchEncription = async function (password, passwordHash) {
    try {

        password = password.trim()
        const matchPassword = await bcrypt.compare(password, passwordHash)
        return matchPassword

    }
    catch (err) {
        console.log(err)
    }

}



module.exports.setEncription = setEncription
module.exports.matchEncription = matchEncription


