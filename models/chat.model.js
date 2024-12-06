const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        user_id: String,
        room_id: String,
        content: String,
        status: {
            type: String,
            default: "sent",
        }, // sent error deleted
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

const Chat = mongoose.model("Chat", chatSchema, "chats");

module.exports = Chat;
