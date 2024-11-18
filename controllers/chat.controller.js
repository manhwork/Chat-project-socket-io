// [GET] /chat/
module.exports.index = async (req, res) => {
    _io.once("connection", (socket) => {
        console.log("a user connected", socket.id);
        socket.on("CLIENT_SEND_MESS", (content) => {
            _io.emit("SERVER_SEND_MESS", {
                content,
            });
        });
    });
    res.render("../views/pages/chat/index.pug");
};

// [POST] /chat/

module.exports.message = async (req, res) => {
    console.log(req.body);
    res.send("ok");
};
