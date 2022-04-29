const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        maxLength: 8
    },
    currencyId: {
        type: String,
        required: true,
        trim: true,
    },
    currencyFormat: {
        type: String,
        required: true,
        trim: true,
    },
    isFreeShipping: {
        type: Boolean,
        default: false
    },
    productImage: [
        {
            public_id: {
                type: String,
                required: true,
                trim: true
            },
            url: {
                type: String,
                required: true,
                trim: true
            },
        },
    ],
    category: {
        type: String,
        required: true,
        trim: true
    },
    Stock: {
        type: Number,
        required: true,
        maxLength: 4,
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    avgRating: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            userId: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
                trim: true
            },
            name: {
                type: String,
                required: true,
                trim: true
            },
            rating: {
                type: Number,
                required: true,
                trim: true
            },
            comment: {
                type: String,
                required: true,
                trim: true
            },
        },
    ],
    availableSizes: {
        type: [String],
        required: true,
        trim: true,
        enum: ["S", "XS", "M", "X", "L", "XXL", "XL"]
    },
    installments: {
        type: Number,
        trim: true,
        default: 0
    },
}, { timestamps: true });



module.exports = mongoose.model('product', productSchema);


