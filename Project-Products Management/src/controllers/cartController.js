const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const validator = require("../validator/productValidator")
const error = require("http-errors")
const catchAsyncErrors = require("../utils/catchAsyncErrors")
const sendSuccess = require("../utils/sender")




//********************************************************* Add to cart  ********************************************************************//




const addToCart = catchAsyncErrors(async function (req, res, next) {


    if (validator.isValidRequestBody(req.query)) return next(error(405, "can not pass request query. query is blocked"))
    if (!validator.isValidRequestBody(req.body) || Object.keys(req.body).length > 2) return next(error(400, `please provide productId and quantity in request body.`))


    const { productId, quantity } = req.body
    if (!validator.isValidRequestValue(productId)) return next(error(400, `please provide productId. `))


    if (!validator.isValidRequestValue(quantity) || !validator.isValidInstallments(quantity) || quantity <= 0)
        return next(error(400, 'quantity should be a numeric positive integer value and minimum 1'))


    const isProductExist = await productModel.findOne({ _id: productId, isDeleted: false })
    if (!isProductExist) return next(error(404, 'product does not exist'))


    const isCartExist = await cartModel.findOne({ userId: req.params.userId })


    // After all validation There is only two case or user cart exist or user cart not exist

    if (!isCartExist) {  // if not exist


        const saveCart = {}
        saveCart['userId'] = req.user._id
        saveCart['name'] = (req.user.fname) + ' ' + (req.user.lname)
        saveCart['email'] = req.user.email


        const saveItem = {}
        saveItem['productId'] = isProductExist._id
        saveItem['name'] = isProductExist.name
        saveItem['price'] = isProductExist.price   // not clear currency
        saveItem['quantity'] = quantity
        saveCart['items'] = [saveItem]


        const totalPrice = quantity * isProductExist.price
        saveCart['totalPrice'] = totalPrice
        saveCart['totalItems'] = saveCart.items.length


        const saveCartData = await cartModel.create(saveCart)
        console.log('saveCartData' , saveCartData)


        return sendSuccess(201, saveCartData, res)

    }


    // if user cart exist There is only two case or same product allready exist in cart or same product not exist in cart

    if (isCartExist) {  


        // if same product allready exist

        for (let i = 0; i < isCartExist.items.length; i++) {

            if (isCartExist.items[i].productId == productId) {

                isCartExist.items[i].quantity = isCartExist.items[i].quantity + quantity
                const updateCart = { '$set': {} }


                updateCart['$set']['items'] = isCartExist.items
                updateCart['$set']['totalPrice'] = isCartExist.totalPrice + quantity * isProductExist.price
                updateCart['$set']['totalItems'] = isCartExist.items.length


                console.log("saveCartData", updateCart)
                const saveCartData = await cartModel.findOneAndUpdate({ userId: req.params.userId }, updateCart, {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false,
                })

                return sendSuccess(200, saveCartData, res)

            }

        }


        // if same product not exist in cart

        const saveCart = { '$set': {} }
        const saveItem = {}


        saveItem['productId'] = isProductExist._id
        saveItem['name'] = isProductExist.name
        saveItem['price'] = isProductExist.price   // not clear currency & round decimal
        saveItem['quantity'] = quantity


        const newItems = isCartExist.items
        newItems.push(saveItem)
        saveCart['$set']['items'] = newItems


        const newTotalPrice = isCartExist.totalPrice + quantity * isProductExist.price
        saveCart['$set']['totalPrice'] = newTotalPrice
        saveCart['$set']['totalItems'] = newItems.length


        console.log(saveCart, "saveCartData")
        const saveCartData = await cartModel.findOneAndUpdate({ userId: req.params.userId }, saveCart, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })


        return sendSuccess(200, saveCartData, res)

    }

})




//********************************************************* remove product from cart ********************************************************************//




const removeProductFromCart = catchAsyncErrors(async function (req, res, next) {


    if (validator.isValidRequestBody(req.query)) return next(error(405, "can not pass request query. query is blocked"))


    let isCartExist = await cartModel.findOne({ userId: req.params.userId })
    if (!isCartExist) return next(error(404, 'cart not found'))


    const suggestionData = `{'productId': '62556bc926c7f67d579eb459', 'removeProduct': 2 }`
    if (!validator.isValidRequestBody(req.body) || Object.keys(req.body).length > 2) return next(error(400, `please provide productId and removeProduct in request body. suggestionData: ${suggestionData}`))


    const { productId, removeProduct } = req.body
    if (!validator.isValidRequestValue(productId)) return next(error(400, `please provide productId. `))
    if (!validator.isValidRequestValue(removeProduct) || !validator.isValidInstallments(removeProduct) || removeProduct <= 0)
        return next(error(400, 'removeProduct should be a numeric positive integer value and minimum 1'))


    const isProductExist = await productModel.findOne({ _id: productId, isDeleted: false })
    if (!isProductExist) return next(error(404, 'product does not exist'))


    // after all validation there is only two case or product found in cart or product not found in cart

    for (let i = 0; i < isCartExist.items.length; i++) {

        // if product found there is three case or removeProduct more than quantity or removeProduct less than quantity or removeProduct equal to quantity

        if (isCartExist.items[i].productId == productId) {

            // if removeProduct more than quantity

            if (isCartExist.items[i].quantity < removeProduct)
                return next(error(400, `Only ${isCartExist.items[i].quantity} product is present in your cart. Your removeProduct is higher. Please select suitable`))


            // if removeProduct is equal to quantity than it must your items not be empty it contains at least one product

            if (isCartExist.items[i].quantity == removeProduct) {
                delete isCartExist.items[i]
                const temp = []
                isCartExist.items.filter((ele) => ele != undefined ? temp.push(ele) : ele)


                // your cart must contain atleast 1 product
                if (temp.length == 0) return next(error(400, "your cart should contain atleast 1 product. After removing this your cart is empty. please reduce you removeProduct atleast 1"))


                const saveCart = { '$set': {} }
                saveCart['$set']['items'] = temp


                const newTotalPrice = isCartExist.totalPrice - removeProduct * isProductExist.price
                saveCart['$set']['totalPrice'] = newTotalPrice
                saveCart['$set']['totalItems'] = temp.length


                console.log(saveCart, "saveCartData")
                const saveCartData = await cartModel.findOneAndUpdate({ userId: req.params.userId }, saveCart, {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false,
                })

                return sendSuccess(200, saveCartData, res)

            }

            // if remove product less than quantity


            const saveCart = { '$set': {} }
            isCartExist.items[i].quantity = isCartExist.items[i].quantity - removeProduct
            saveCart['$set']['items'] = isCartExist.items


            const newTotalPrice = isCartExist.totalPrice - removeProduct * isProductExist.price
            saveCart['$set']['totalPrice'] = newTotalPrice
            saveCart['$set']['totalItems'] = isCartExist.items.length


            console.log(saveCart, "saveCartData")
            const saveCartData = await cartModel.findOneAndUpdate({ userId: req.params.userId }, saveCart, {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            })

            return sendSuccess(200, saveCartData, res)

        }

    }

    // if product not found in cart

    return next(error(404, 'product not found in cart'))

})




//********************************************************* get user cart ********************************************************************//




const userCart =catchAsyncErrors(async function (req, res, next) {
    
    if (validator.isValidRequestBody(req.query)) return next(error(405, 'req query not allowed'))
    if (validator.isValidRequestBody(req.body)) return next(error(405, 'req body not allowed'))


        const isCartExist = await cartModel.findOne({ userId: req.params.userId })
        if (!isCartExist) return next(error(404, 'cart not found'))


        return sendSuccess(200,isCartExist,res)

    })




//********************************************************* delete user cart ********************************************************************//




const deleteUserCart = catchAsyncErrors(async function (req, res, next) {
    
    if (validator.isValidRequestBody(req.query)) return next(error(405, 'req query not allowed'))
    if (validator.isValidRequestBody(req.body)) return next(error(405, 'req body not allowed'))


    const isCartExist = await cartModel.findOne({ userId: req.params.userId })
    if (!isCartExist) return next(error(404, 'cart not found'))


        const saveCart = {'$set':{}}
        saveCart['$set']['items'] = []
        saveCart['$set']['totalPrice'] = 0
        saveCart['$set']['totalItems'] = 0


        console.log(saveCart, "saveCartData")
        const saveCartData = await cartModel.findOneAndUpdate({ userId: req.params.userId }, saveCart, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })

        return sendSuccess(200, saveCartData, res)

    })
   



module.exports = {

    addToCart,
    removeProductFromCart,
    userCart,
    deleteUserCart

}


