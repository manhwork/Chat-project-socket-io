const mongoose = require("mongoose");
const generateToken = require("../helpers/generateToken");

const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        avatar: {
            type: String,
            default:
                "https://www.shareicon.net/download/2015/10/09/653498_users.svg",
        },
        phone: String,
        address: String,
        acceptFriends: Array,
        requestFriends: Array,
        friendsList: [
            {
                user_id: String,
                room_id: String,
            },
        ],
        status: {
            type: String,
            default: "active", // active warrning inactive
        },
        token: {
            type: String,
            default: generateToken.generateRandomString(20),
        },
    },
    {
        timestamp: true,
    }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
