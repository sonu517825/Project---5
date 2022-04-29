const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const orderSchema = new mongoose.Schema({

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
            min: 1,
            trim: true
        },// must be minimum 1
    }],
    totalPrice: {
        type: Number,
        required: true,
        trim: true
    },
    totalItems: {
        type: Number,
        required: true,
        trim: true
    },
    totalQuantity: {
        type: Number,
        required: true,
        trim: true
    },
    paymentInfo: {
        id: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            required: true,
            trim: true
        },
    },
    paidAt: {
        type: Date,
        required: true,
        trim: true
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Pending",
        enum: ['pending', 'completed', 'cancled'],
        trim: true
    },
    deliveredAt: Date,
    shippingInfo: {
        address: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        state: {
            type: String,
            required: true,
            trim: true
        },
        country: {
            type: String,
            required: true,
            trim: true
        },
        pinCode: {
            type: Number,
            required: true,
            trim: true
        },
    },
}, { timestamps: true });



module.exports = mongoose.model('order', orderSchema);


