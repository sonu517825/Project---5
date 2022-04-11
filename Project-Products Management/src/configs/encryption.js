const bcrypt = require("bcryptjs")


const setEncription = async function (password) {
    try {

        password = password.trim()
        const saltRounds = 10

        const passwordHash = await bcrypt.hash(password, saltRounds)
        console.log("encriptedPassword : ", passwordHash)
        return passwordHash

    }
    catch (err) {
        console.log(err)
    }
}



module.exports.setEncription = setEncription