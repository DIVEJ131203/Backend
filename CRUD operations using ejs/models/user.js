const mongoose = require("mongoose");

// Define the schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true }
});

// Export the model
module.exports = mongoose.model("User", userSchema);
