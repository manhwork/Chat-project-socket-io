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
            // thêm id của B vào requestFriends của A tức danh sách gửi lời mời kết bạn A có B
            await User.updateOne(
                {
                    _id: userId,
                    status: "active",
                },
                {
                    $push: { requestFriends: data.notFriendId },
                }
            );
            // thêm id của A vào acceptFriends của B tức là danh sách chờ xác nhận kết bạn của B có A
            await User.updateOne(
                {
                    _id: data.notFriendId,
                    status: "active",
                },
                {
                    $push: { acceptFriends: userId },
                }
            );
        });

        socket.on("CLIENT_SEND_CANCEL_SENT_FRIEND", async (data) => {
            // thêm id của B vào requestFriends của A tức danh sách gửi lời mời kết bạn A có B
            await User.updateOne(
                {
                    _id: userId,
                    status: "active",
                },
                {
                    $pull: { requestFriends: data.notFriendId },
                }
            );
            // thêm id của A vào acceptFriends của B tức là danh sách chờ xác nhận kết bạn của B có A
            await User.updateOne(
                {
                    _id: data.notFriendId,
                    status: "active",
                },
                {
                    $pull: { acceptFriends: userId },
                }
            );
        });
    });

    res.render("../views/pages/users/index.pug", {
        pageTitle: "Danh sách người dùng",
        users: users,
    });
};
