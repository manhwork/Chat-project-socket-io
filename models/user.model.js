const mongoose = require("mongoose");
const generateToken = require("../helpers/generateRandom");

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
        acceptFriends: Array, // danh sách người mà ta gửi yêu cầu
        requestFriends: Array, // danh sách người mà đã gửi yêu cầu đến ta
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
        },
    },
    {
        timestamp: true,
    }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
