const Chat = require("../models/chat.model");
const User = require("../models/user.model");

// [GET] /chat/
module.exports.index = async (req, res) => {
    const user = res.locals.userInfo;
    const user_id = user._id;
    const fullName = user.fullName;

    _io.once("connection", (socket) => {
        console.log("User " + socket.id + " connected");

        socket.on("CLIENT_SEND_MESS", async (content) => {
            // Luu vao db
            const chat = new Chat({
                content: content,
                user_id: user._id,
            });
            await chat.save();
            // end luu vao db
            _io.emit("SERVER_SEND_MESS", {
                content,
                user_id,
                fullName,
            });
        });
    });

    const chats = await Chat.find({
        status: "sent",
    });
    if (chats) {
        for (const chat of chats) {
            const infoUser = await User.findOne({
                _id: chat.user_id,
                status: "active",
            });
            if (infoUser) {
                chat.fullName = infoUser.fullName;
            }
        }
    }

    res.render("../views/pages/chat/index.pug", {
        pageTitle: "Tin nhắn",
        chats: chats,
    });
};

// [POST] /chat/

module.exports.messagePost = async (req, res) => {
    console.log(req.body);
    res.send("ok");
};
