const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/products');

let productSchema = new mongoose.Schema({
    price: String,
    title: String,
    image: String
}, { collection: 'productsCollection' }
);
 
module.exports = { Mongoose: mongoose, ProductSchema: productSchema }