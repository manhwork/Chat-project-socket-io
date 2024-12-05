const mongoose = require("mongoose");
const generateRandomHelper = require("../helpers/generateRandom");

const otpSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expireAt: {
            type: Date,
            expires: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Otp = mongoose.model("Otp", otpSchema, "otps");

module.exports = Otp;
