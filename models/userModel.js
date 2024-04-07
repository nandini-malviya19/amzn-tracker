const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    link: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
    }],
},
    { timestamps: true }

)

const User = mongoose.model('User', userSchema);

module.exports = User;