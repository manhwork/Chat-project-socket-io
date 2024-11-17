const mongoose = require("mongoose");
const generateToken = require("../helpers/generateToken");

const userSchema = mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        avatar: String,
        status: {
            type: String,
            default: "active",
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
