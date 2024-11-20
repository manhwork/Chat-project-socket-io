const mongoose = require("mongoose");
const generateToken = require("../helpers/generateToken");

const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        avatar: String,
        phone: String,
        address: String,
        status: {
            type: String,
            default: "active", // active warrning inactive
        },
        token: {
            type: String,
            default: generateToken(20),
        },
    },
    {
        timestamp: true,
    }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
