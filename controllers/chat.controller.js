const Chat = require("../models/chat.model");
const User = require("../models/user.model");

// [GET] /chat/
module.exports.index = async (req, res) => {
    _io.once("connection", (socket) => {
        console.log("a user connected", socket.id);
        socket.on("CLIENT_SEND_MESS", async (content) => {
            // Luu vao db
            const chat = new Chat({
                content: content,
            });
            await chat.save();
            // end luu vao db
            _io.emit("SERVER_SEND_MESS", {
                content,
            });
        });
    });

    res.render("../views/pages/chat/index.pug", {
        pageTitle: "Chats",
    });
};

// [POST] /chat/

module.exports.messagePost = async (req, res) => {
    console.log(req.body);
    res.send("ok");
};
