const sendErr = require("../utils/sender")

module.exports = (err, req, res, next) => {


    if (err.name === "ValidationError") return sendErr(400, `Validation failed ${Object.keys(err.errors)} is required`, res)
    if (err.code === 11000) return sendErr(400, `Duplicate ${Object.keys(err.keyValue)} Entered`, res)
    if (err.name === "CastError") return sendErr(400, `Invalid : ${err.path}`, res)


    return sendErr(err.statusCode || 500, err.message, res)


}




process.on('uncaughtException', (err) => {

    console.log({ errPath: err.stack })
    console.log(`message:${err.message}`)
    console.log(`Shutting down the server due to uncaught exception found`);
    process.exit(1) // if not apply than clean exit

})


