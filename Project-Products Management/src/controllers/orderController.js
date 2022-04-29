const orderModel = require("../models/orderModel")
const cartModel = require("../models/cartModel")
const catchAsyncError = require('../utils/catchAsyncErrors')
const validator = require('../validator/userValidator')
const error = require("http-errors")
const { axiosCheck } = require("../utils/axiosConnection")


const newOrder = catchAsyncError(async function (req, res, next) {

    if (validator.isValidRequestBody(req.query)) return next(error(405, 'req query not allowed'))

    const isCartExist = await cartModel.findOne({ userId: req.params.userId })

    if (!isCartExist) return next(error(404, 'No cart found. Please make your cart first'))
    // there is two case cart is exist or not 


    if (isCartExist.totalItems == 0) return next(error(404, 'No items found in your cart to place your order. Please select some items in your cart'))
    // if cart exist now check cart is empty or not



    // if cart exist and not empty than we place the order



    const requestBody = req.body
    if (!validator.isValidRequestBody(requestBody)) return next(error(400, `provide 'address' 'city' and 'pinCode' details in req body`))
    const { address, city, pinCode } = requestBody


    if (!validator.isValidRequestValue(city) || !validator.isStrictString(city)) return next(error(400, 'provide valid city name'))
    if (!validator.isValidRequestValue(address)) return next(error(400, 'provide valid address name'))
    if (!validator.isValidRequestValue(pinCode) || !validator.isValidPincode(pinCode)) return next(error(400, 'provide valid pinCode'))


    let axiosResult = await axiosCheck(pinCode , city)
 // 
    if (axiosResult == '404') return next(error(404, 'your pincode not found'))
    if (axiosResult == '400') return next(error(400, `pinCode's city not match with your city `))

    if (!axiosResult) return next(error(500, 'there is an error to validate your pincode'))

  //  console.log("axiosResult" , axiosResult)

 //   return

   
    const saveOrder = {'shippingInfo':{}}


    saveOrder['userId'] = req.params.userId
    saveOrder['name'] = isCartExist.name
    saveOrder['email'] = isCartExist.email
    saveOrder['items'] = isCartExist.items
    saveOrder['totalPrice'] = isCartExist.totalPrice
    saveOrder['totalItems'] = isCartExist.totalItems


    let totalQuantity = 0
    for (let i = 0; i < isCartExist.items.length; i++)
        totalQuantity = totalQuantity + isCartExist.items[i].quantity

    saveOrder['totalQuantity'] = totalQuantity

    // payment Info
    // paidAt
    // orderStatus
    // key
    // deleverdAt
    
    saveOrder['shippingInfo']=axiosResult
    saveOrder['shippingInfo']['address'] = address
    console.log(saveOrder , "fdfg")
    return


    saveOrder['orderStatus'] = 'pending'

    //const saveOrderData = await cartModel.create(saveOrder)
    console.log("saveCartData", saveOrder)


    return res.status(201).send({ status: true, message: "New Order created", data: "saveCartData" })


})



module.exports = {

    newOrder

}



