// models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: [{
    type: String, // URL o path della foto
    required: true,
  }],
});

module.exports = mongoose.model('Product', productSchema);

