const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const RoomChat = require("../models/room-chat.model");

// [GET] /chat/
module.exports.index = async (req, res) => {
    res.render("../views/pages/chat/index.pug", {
        pageTitle: "Tin nhắn",
    });
};

// [POST] /chat/

module.exports.messagePost = async (req, res) => {
    console.log(req.body);
    res.send("ok");
};

// [GET] /chats/:room_id

module.exports.chatFriend = async (req, res) => {
    const myUser = res.locals.userInfo;
    const user_id = myUser._id;
    const fullName = myUser.fullName;

    const room_id = req.params.room_id;

    const roomInfo = await RoomChat.findOne({
        deleted: false,
        typeRoom: "friend",
        _id: room_id,
    });

    let otherUserId;

    const userIdInRoom = roomInfo.users;

    userIdInRoom.forEach((item) => {
        if (item.user_id !== myUser.id) {
            otherUserId = item.user_id;
        }
    });

    const otherUser = await User.findOne({
        _id: otherUserId,
        status: "active",
    }).select("fullName avatar id");

    _io.once("connection", (socket) => {
        console.log("User " + socket.id + " connected");

        socket.on("CLIENT_SEND_MESS", async (content) => {
            // Luu vao db
            const chat = new Chat({
                content: content,
                user_id: myUser._id,
                room_id: room_id,
            });

            await chat.save();
            // end luu vao db

            _io.emit("SERVER_SEND_MESS", {
                content,
                user_id,
                fullName,
                myUser,
                otherUser,
                room_id,
            });
        });

        socket.on("CLIENT_TYPING", (type) => {
            socket.broadcast.emit("SERVER_SEND_TYPING", {
                room_id,
                myUser,
                otherUser,
                type,
            });
        });
    });

    const chats = await Chat.find({
        status: "sent",
        room_id: room_id,
    });

    res.render("../views/pages/chat/chatFriend.pug", {
        pageTitle: `chat`,
        chats: chats,
        roomInfo: roomInfo,
        otherUser: otherUser,
        myUser: myUser,
    });
};
