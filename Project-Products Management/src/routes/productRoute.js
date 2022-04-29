const express = require("express")
const router = express.Router()
const { createProduct, getProductByFilter, getProductById, updateProduct, 
    deleteProduct, createProductReview , getProductReviews , deleteReview } = require("../controllers/productController")
const { authorization } = require("../middleware/authorization")
const { authentication } = require("../middleware/authuntication")



router.route("/user/:userId/products")
    .post(authentication, authorization, createProduct)



router.route("/products")
    .get(getProductByFilter)



router.route("/products/:productId")
    .get(getProductById)



router.route("/user/:userId/products/:productId")
    .put(authentication, authorization, updateProduct)
    .delete(authentication, authorization, deleteProduct)




router.route("/user/:userId/review")
    .put(authentication, authorization , createProductReview)
    .delete(authentication, authorization, deleteReview);


router.route("/reviews")
    .get(getProductReviews)



module.exports = router



