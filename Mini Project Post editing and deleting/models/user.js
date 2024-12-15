const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    age: Number,
    name: String,
    password: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }]
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;

