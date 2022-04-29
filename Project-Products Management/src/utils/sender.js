
const respons = async function (statusCode, message, res) {

    return res.status(statusCode).json({ message })

}

module.exports = respons

