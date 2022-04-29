const productModel = require("../models/productModel")
const validator = require("../validator/productValidator")
const awsConnection = require("../utils/awsConnection")
const currencySymbol = require("currency-symbol-map")
const catchAsyncError = require("../utils/catchAsyncErrors")
const error = require("http-errors")
const sendSuccess = require("../utils/sender")




//********************************************************* Create Product ********************************************************************//




const createProduct = catchAsyncError(async function (req, res, next) {


    if (validator.isValidRequestBody(req.query)) return next(error(405, 'req query not allowed'))
    const requestBody = req.body
    if (!validator.isValidRequestBody(requestBody)) return next(error(400, 'provide product data in req body'))


    const { name, description, price, isFreeShipping, category, stock, availableSizes, installments, } = requestBody;
    const finalProductData = {}


    if (!validator.isValidRequestValue(name) || !validator.isStrictString(name)) return next(error(400, 'in name only pass a to z or A to Z'))
    finalProductData['name'] = name


    if (!validator.isValidRequestValue(description) || !validator.isNormalString(description)) return next(error(400, `only valid description , suggestion : 'sonu @ Verma 123' `))
    finalProductData['description'] = description


    if (!validator.isValidRequestValue(price) || !validator.isValidPrice(price)) return next(error(400, `'price' You can pass only 0 to 9 digit or decimal number.`))
    finalProductData['price'] = price
    finalProductData['currencyId'] = 'INR'
    finalProductData['currencyFormat'] = currencySymbol('INR')



    if ('isFreeShipping' in req.body) {

        if (!validator.isValidRequestValue(isFreeShipping) || !((isFreeShipping === "true") || (isFreeShipping === "false"))) return next(error(400, 'isFreeShipping must be a boolean value'))
        finalProductData['isFreeShipping'] = isFreeShipping

    }


    // const ProductImage = await awsConnection.uploadProfileImage(req.files)
    // if (!ProductImage) return res.status(400).send({ status: false, message: ` Key Name : 'productImage' You can pass only files. Make sure you can not pass only key name or a blank key` })
    // finalProductData['productImage'] = ProductImage


    if (!validator.isValidRequestValue(category) || !validator.isNormalString(category)) return next(error(400, ` please provide valid category. suggestion: 'sonu @ Verma 123' `))
    finalProductData['category'] = category


    if (!validator.isValidRequestValue(stock) || !validator.isValidInstallments(stock) || stock > 9999) return next(error(400, ` please provide valid stock. maxStock:9999 `))
    finalProductData['stock'] = stock


    const temp = `['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL']`
    if (!validator.isValidRequestValue(availableSizes)) return next(error(400, `Available Sizes must be among ${temp}`))
    const flag = await validator.isValidAvailableSizes(availableSizes)
    if (!flag) return next(error(400, `Available Sizes must be among ${temp}`))
    finalProductData['availableSizes'] = flag


    if ('installments' in req.body) {

        if (!validator.isValidRequestValue(installments) || !validator.isValidInstallments(installments)) return next(error(400, 'please provide valid installments '))
        finalProductData['installments'] = installments

    }


    if ('reviews' in req.body || 'numOfReviews' in req.body || 'avgRating' in req.body) return next(error(405, `not allow here [ 'reviews' , 'avgRating' , 'numOfReviews' ]`))


    console.log("givenFinalProductData", finalProductData)
    const saveProductDetails = await productModel.create(finalProductData)
    return res.status(201).send({ status: true, message: "product saved Successfully", data: saveProductDetails })

})




//********************************************************* Get Product By Filter ********************************************************************//




const getProductByFilter = catchAsyncError(async (req, res, next) => {


    if (validator.isValidRequestBody(req.body)) return next(error(405, 'request body not allowed'))


    const filters = req.query
    const finalFilters = { isDeleted: false }


    const { page, name, size, priceGreaterThan, priceLessThan, priceSort, installments, category, isFreeShipping } = filters


    const TotalApplyFilter = Object.keys(req.query).length
    const TotalAvailableStock = await productModel.countDocuments()


    const resultPerPage = 5
    let currenetPage = 1
    let skip = 0


    if ('page' in req.query) {

        if (!validator.isValidPrice(page)) return next(error(400, `'page' You can pass only number not from 0`))
        currenetPage = Number(req.query.page)
        skip = resultPerPage * (currenetPage - 1)

    }


    if ('name' in req.query) {

        if (!validator.isValidRequestValue(name) || !validator.isStrictString(name)) return next(error(400, 'in name only pass a to z or A to Z'))
        finalFilters['name'] = { $regex: name, $options: 'i' }

    }


    if ('size' in req.query) {

        const temp = `['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL']`
        if (!validator.isValidRequestValue(availableSizes)) return next(error(400, `Available Sizes must be among ${temp}`))
        const flag = await validator.isValidAvailableSizes(availableSizes)
        if (!flag) return next(error(400, `Available Sizes must be among ${temp}`))
        finalFilters['availableSizes'] = { $in: [...size] }

    }


    if (('priceGreaterThan' in req.query) || ('priceLessThan' in req.query) || ('priceGreaterThan' in req.query && 'priceLessThan' in req.query)) {


        if (('priceGreaterThan' in req.query) && ('priceLessThan' in req.query)) {

            if (!validator.isValidRequestValue(priceGreaterThan) || !validator.isValidPrice(priceGreaterThan)) return next(error(400, `'priceGreaterThan' You can pass only a valid price 0 to 9 digit or decimal number.`))
            if (!validator.isValidRequestValue(priceLessThan) || !validator.isValidPrice(priceLessThan)) return next(error(400, `'priceLessThan' You can pass only a valid price 0 to 9 digit or decimal number.`))
            let x = parseInt(priceGreaterThan)
            let y = parseInt(priceLessThan)
            finalFilters['price'] = { $gte: x, $lte: y }

        }
        else if ('priceGreaterThan' in req.query) {

            if (!validator.isValidRequestValue(priceGreaterThan) || !validator.isValidPrice(priceGreaterThan)) return next(error(400, `'priceGreaterThan' You can pass only a valid price 0 to 9 digit or decimal number.`))
            let x = parseInt(priceGreaterThan)
            finalFilters['price'] = { $gte: x }

        }
        else if ('priceLessThan' in req.query) {

            if (!validator.isValidRequestValue(priceLessThan) || !validator.isValidPrice(priceLessThan)) return next(error(400, `'priceLessThan' You can pass only a valid price 0 to 9 digit or decimal number.`))
            let x = parseInt(priceLessThan)
            finalFilters['price'] = { $lte: x }

        }

    }


    if ('isFreeShipping' in req.query) {

        if (!validator.isValidRequestValue(isFreeShipping) || !((isFreeShipping === "true") || (isFreeShipping === "false"))) return next(error(400, 'isFreeShipping must be a boolean value'))
        finalFilters['isFreeShipping'] = isFreeShipping

    }


    if ('category' in req.query) {

        if (!validator.isValidRequestValue(category) || !validator.isNormalString(category)) return next(error(400, ` please provide valid category. suggestion: 'sonu @ Verma 123' `))
        finalFilters['category'] = category

    }


    if ('stock' in req.query) {

        if (!validator.isValidRequestValue(stock) || !validator.isValidInstallments(stock) || stock > 9999) return next(error(400, ` please provide valid stock. maxStock:9999 `))
        finalFilters['stock'] = stock

    }


    if ('installments' in req.query) {

        if (!validator.isValidRequestValue(installments) || !validator.isValidInstallments(installments)) return next(error(400, 'please provide valid installments '))
        finalFilters['installments'] = installments

    }


    const sendData = { TotalAvailableStock, TotalApplyFilter, resultPerPage, skip, currenetPage, }


    if ('priceSort' in req.query) {


        if (!validator.isValidRequestValue(priceSort) || !validator.isValidPriceSort(priceSort)) return next(error(400, `Please enter valid input for sorting in price ....... 1 : for ascending order or -1 : for descending order `))


        if (priceSort == 1) {

            console.log("finalFilters with sort", finalFilters)
            const allProducts = await productModel.find(finalFilters).limit(resultPerPage).skip(skip).sort({ price: 1 })
            if (allProducts.length == 0) return next(error(400, `Product not Found, suggestion: return previous page or reduce your filter`))
            sendData.products = allProducts
            return sendSuccess(200, sendData, res)

        }


        if (priceSort == -1) {

            console.log("finalFilters with sort", finalFilters)
            const allProducts = await productModel.find(finalFilters).limit(resultPerPage).skip(skip).sort({ price: -1 })
            if (allProducts.length == 0) return next(error(400, `Product not Found, suggestion: return previous page or reduce your filter`))
            sendData.products = allProducts
            return sendSuccess(200, sendData, res)

        }

    }


    console.log("finalFilters witout sort", finalFilters)
    const allProducts = await productModel.find(finalFilters).limit(resultPerPage).skip(skip)
    if (allProducts.length == 0) return next(error(400, `Product not Found, suggestion: return previous page or reduce your filter`))
    sendData.products = allProducts
    return sendSuccess(200, sendData, res)

})




//********************************************************* Get Product BY Id ********************************************************************//




const getProductById = catchAsyncError(async function (req, res, next) {


    if (validator.isValidRequestBody(req.query)) return next(error(405, 'req query not allowed'))
    if (validator.isValidRequestBody(req.body)) return next(error(405, 'req body not allowed'))


    const isProductPresent = await productModel.findById(req.params.productId)
    if (!isProductPresent) return next(error(404, 'product not found'))
    return sendSuccess(200, isProductPresent, res)


})




//********************************************************* Update Product ********************************************************************//




const updateProduct = catchAsyncError(async function (req, res, next) {


    if (validator.isValidRequestBody(req.query)) return next(error(405, 'req query not allowed'))


    const isProductPresent = await productModel.findById(req.params.productId)
    if (!isProductPresent) return next(error(404, 'product not found'))


    const requestBody = req.body
    let { name, description, price, isFreeShipping, productImage, availableSizes, sizeFlag, installments } = requestBody
    const updateProductData = { '$set': {} }


    if ('name' in req.body) {

        if (!validator.isValidRequestValue(name) || !validator.isStrictString(name)) return next(error(400, 'in name only pass a to z or A to Z'))
        updateProductData['$set']['name'] = name

    }


    if ('description' in req.body) {

        if (!validator.isValidRequestValue(description) || !validator.isNormalString(description)) return next(error(400, `only valid description , suggestion : 'sonu @ Verma 123' `))
        updateProductData['$set']['description'] = description

    }


    if ('price' in req.body) {

        if (!validator.isValidRequestValue(price) || !validator.isValidPrice(price)) return next(error(400, `'price' You can pass only 0 to 9 digit or decimal number.`))
        updateProductData['$set']['price'] = price

    }


    if ('isFreeShipping' in req.body) {

        if (!validator.isValidRequestValue(isFreeShipping) || !((isFreeShipping === "true") || (isFreeShipping === "false"))) return next(error(400, 'isFreeShipping must be a boolean value'))
        updateProductData['$set']['isFreeShipping'] = isFreeShipping

    }


    // if (req.files && req.files.length > 0) {
    //
    //     const ProductImage = await awsConnection.uploadProfileImage(req.files)
    //     if (!ProductImage) return res.status(400).send({ status: false, message: ` Key Name : 'productImage' You can pass only files. Make sure you can not pass only key name or a blank key` })
    //     updateProductData['$set']['productImage'] = ProductImage
    //
    // }


    if ('category' in req.body) {

        if (!validator.isValidRequestValue(category) || !validator.isNormalString(category)) return next(error(400, ` please provide valid category. suggestion: 'sonu @ Verma 123' `))
        updateProductData['$set']['category'] = category

    }


    if ('stock' in req.body) {

        if (!validator.isValidRequestValue(stock) || !validator.isValidInstallments(stock) || stock > 9999) return next(error(400, ` please provide valid stock. maxStock:9999 `))
        updateProductData['$set']['stock'] = stock

    }


    if ('installments' in req.query) {

        if (!validator.isValidRequestValue(installments) || !validator.isValidInstallments(installments)) return next(error(400, 'please provide valid installments '))
        updateProductData['$set']['installments'] = installments

    }


    if ('reviews' in req.body || 'numOfReviews' in req.body || 'avgRating' in req.body) return next(error(405, `not allow here [ 'reviews' , 'avgRating' , 'numOfReviews' ]`))


    if ('availableSizes' in req.body) {


        if (!validator.isValidRequestValue(sizeFlag) || !((sizeFlag === 'Inc') || (sizeFlag === 'Drc'))) return next(error(400, `please pass 'sizeFlag' ... 'Inc' OR ...'Drc'. Inc: Increment , Drc: Decrement`))


        if (sizeFlag === 'Inc') {

            const temp = `['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL']`
            if (!validator.isValidRequestValue(availableSizes)) return next(error(400, `Available Sizes must be among ${temp}`))
            const flag = await validator.isValidAvailableSizes(availableSizes)
            if (!flag) return next(error(400, `Available Sizes must be among ${temp}`))
            flag.filter((ele) => isProductPresent.availableSizes.includes(ele) ? ele : isProductPresent.availableSizes.push(ele))
            updateProductData['$set']['availableSizes'] = isProductPresent.availableSizes

        }


        if (sizeFlag === 'Drc') {   // not handle empty size

            const temp = `['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL']`
            if (!validator.isValidRequestValue(availableSizes)) return next(error(400, `Available Sizes must be among ${temp}`))
            const flag = await validator.isValidAvailableSizes(availableSizes)
            if (!flag) return next(error(400, `Available Sizes must be among ${temp}`))
            let finalFlag = []
            isProductPresent.availableSizes.filter((ele) => flag.includes(ele) ? ele : finalFlag.push(ele))
            updateProductData['$set']['availableSizes'] = finalFlag

        }

    }


    console.log("updateProductData", updateProductData)


    const updatedData = await productModel.findOneAndUpdate({ _id: req.params.productId }, updateProductData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    sendSuccess(200, updatedData, res)


})




//********************************************************* Delete Product ********************************************************************//




const deleteProduct = catchAsyncError(async function (req, res, next) {


    if (validator.isValidRequestBody(req.query)) return next(error(405, 'req query not allowed'))
    if (validator.isValidRequestBody(req.body)) return next(error(405, 'req body not allowed'))


    const deleteProduct = await productModel.findOneAndDelete({ _id: req.params.productId })
    if (!deleteProduct) return next(error(404, 'No document found'))
    return sendSuccess(200, `Deleted Documents : ${deleteProduct}`, res)


})




//********************************************************* create Product review ********************************************************************//




const createProductReview = catchAsyncError(async function (req, res, next) {


    if (validator.isValidRequestBody(req.query)) return next(error(405, 'req query not allowed'))
    if (!validator.isValidRequestBody(req.body)) return next(error(404, `please provide 'rating' 'comment' 'productId' in req body `))


    const { rating, comment, productId } = req.body;
    const isProductPresent = await productModel.findById(productId)
    if (!isProductPresent) return next(error(404, 'product not found'))


    if (!validator.isValidRequestValue(rating) || !validator.isValidPrice(rating)) return next(error(400, `'rating' You can pass only 0 to 9 digit or decimal number.`))
    if (!validator.isValidRequestValue(comment) || !validator.isNormalString(comment)) return next(error(400, ` please provide valid comment. suggestion: 'sonu @ Verma 123' `))
    const updateProductReview = { '$set': {}, '$push': {} }
    const reviewData = {}


    //  const isReviewed = isProductPresent.reviews.find((rev) => rev.userId == req.user._id)
    // not cover if user already reviewed


    updateProductReview['$set']['numOfReviews'] = isProductPresent.reviews.length + 1
    reviewData['userId'] = req.user._id
    reviewData['name'] = (req.user.fname) + ' ' + (req.user.lname)
    reviewData['rating'] = rating
    reviewData['comment'] = comment


    let allRating = rating;
    isProductPresent.reviews.forEach((rev) => allRating += rev.rating);
    updateProductReview['$set']['avgRating'] = allRating / (isProductPresent.reviews.length + 1)
    updateProductReview['$push']['reviews'] = reviewData


    console.log("updateProductReview", updateProductReview)


    const updatedData = await productModel.findOneAndUpdate({ _id: productId }, updateProductReview, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    sendSuccess(200, updatedData, res)


})




//********************************************************* get Product review ********************************************************************//




const getProductReviews = catchAsyncError(async function (req, res, next) {


    if (validator.isValidRequestBody(req.body)) return next(error(405, 'req body not allowed'))
    if (!validator.isValidRequestValue(req.query.productId)) return next(error(400, `please provide 'productId' in req query `))


    const isProductPresent = await productModel.findById(req.query.productId)
    if (!isProductPresent) return next(error(404, 'product not found'))
    let review = {}
    review.numOfReviews = isProductPresent.numOfReviews
    review.avgRating = isProductPresent.avgRating
    review.reviews = isProductPresent.reviews
    return sendSuccess(200, review, res)


})




//********************************************************* Delete review ********************************************************************//




const deleteReview = catchAsyncError(async function (req, res, next) {


    if (validator.isValidRequestBody(req.body)) return next(error(405, 'req body not allowed'))
    if (!validator.isValidRequestValue(req.query.productId)) return next(error(400, `please provide 'productId' in req query `))
    if (!validator.isValidRequestValue(req.query.reviewId)) return next(error(400, `please provide 'reviewId' in req query `))


    const isProductPresent = await productModel.findById(req.query.productId)
    if (!isProductPresent) return next(error(404, 'product not found'))
    const updateProductReview = { '$set': {}, }


    // not cover if review already deleted or no review present
    const reviews = isProductPresent.reviews.filter((rev) => rev._id != req.query.reviewId);


    let allRating = 0
    reviews.forEach((rev) => allRating += rev.rating);


    let avgRating = 0
    if (reviews.length == 0)
        avgRating = 0
    else
        avgRating = allRating / reviews.length


    updateProductReview['$set']['numOfReviews'] = reviews.length
    updateProductReview['$set']['avgRating'] = avgRating
    updateProductReview['$set']['reviews'] = reviews


    console.log("updateProductReview", updateProductReview)


    const updatedData = await productModel.findOneAndUpdate({ _id: req.query.productId }, updateProductReview, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })


    sendSuccess(200, updatedData, res)


})




module.exports = {

    createProduct,
    getProductByFilter,
    getProductById,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteReview

}


