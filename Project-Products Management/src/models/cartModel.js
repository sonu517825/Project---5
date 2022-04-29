const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const cartSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: 'user',
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    items: [{
        productId: {
            type: ObjectId,
            required: true,
            ref: 'product',
            trim: true
        },
        name: {
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
        quantity: {
            type: Number,
            required: true,
            min: 1
        },// must be minimum 1
    }],
    totalPrice: {
        type: Number,
        required: true,
    },
    totalItems: {
        type: Number,
        required: true,
    },
}, { timestamps: true });



module.exports = mongoose.model('cart', cartSchema);


