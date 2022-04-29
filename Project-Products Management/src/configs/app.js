const express = require("express")
const cookieParser = require('cookie-parser')
const multer = require("multer")
const logger = require("morgan")
const createError = require("http-errors")
const app = express()
const errHandler = require("../middleware/errHandler")



const userRoute = require("../routes/userRoute")
const productRoute = require("../routes/productRoute")
const cartRoute = require("../routes/cartRoute")
const orderRoute = require("../routes/orderRoute")



app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(multer().any())
app.use(logger('combined'))  // combined, common, short, tiny , dev  // preseter



app.use('/', userRoute);
app.use('/', productRoute)
app.use('/', cartRoute)
app.use('/', orderRoute)




app.use((req, res, next) => {

  next(createError(404, 'URL not found'))

})
app.use(errHandler)


module.exports = app


