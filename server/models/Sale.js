const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    productName: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Formation', 'Ebook', 'Coaching', 'Service']
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    cost: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

module.exports = mongoose.model('Sale', saleSchema);
