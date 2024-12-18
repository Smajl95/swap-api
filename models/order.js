const mongoose = require('mongoose');

// Schema Ordine
const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Collegamento al modello `Product`
        required: true,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Collegamento al modello `User`
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'], // Stato dell'ordine
      default: 'pending',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Aggiunge createdAt e updatedAt
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
