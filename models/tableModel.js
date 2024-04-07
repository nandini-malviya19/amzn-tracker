const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");


const tableSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pricing: { type: String, required: true },
    alias: { type: String, required: true },
   
},
    { timestamps: true }

)

const Item = mongoose.model('Item', tableSchema);

module.exports = Item;