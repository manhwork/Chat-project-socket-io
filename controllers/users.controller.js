const User = require("../models/user.model");

// [GET] /user/not-friend

module.exports.index = async (req, res) => {
    const userId = res.locals.userInfo.id;

    const users = await User.find({
        status: "active",
        _id: { $ne: userId },
    });

    _io.once("connection", (socket) => {
        console.log("User " + socket.id + " connected");

        socket.on("CLIENT_SEND_SENT_FRIEND", async (data) => {
            await User.updateOne(
                {
                    _id: userId,
                    status: "active",
                },
                {
                    $push: { requestFriends: data.notFriendId },
                }
            );
        });
    });

    res.render("../views/pages/users/index.pug", {
        pageTitle: "Danh sách người dùng",
        users: users,
    });
};
