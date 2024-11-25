const User = require("../models/user.model");
const getInfoFriendDetailHelper = require("../helpers/getInfoFriendDetail");
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
            // xoa id của B vào requestFriends của A tức danh sách gửi lời mời kết bạn A có B
            await User.updateOne(
                {
                    _id: userId,
                    status: "active",
                },
                {
                    $pull: { requestFriends: data.notFriendId },
                }
            );
            // xoa id của A vào acceptFriends của B tức là danh sách chờ xác nhận kết bạn của B có A
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

// [GET] /users/friend-invitation
module.exports.friendInvitation = async (req, res) => {
    const currentUser = res.locals.userInfo;

    const pendingFriendRequests = currentUser.acceptFriends;
    // cach 1 :
    const friendDetailsList = await getInfoFriendDetailHelper(
        pendingFriendRequests
    );

    // cach 2 :
    // const friendDetailsList = [];
    // getInfoFriendDetailHelper(pendingFriendRequests)
    //     .then((data) => {
    //         console.log(data);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });

    _io.once("connection", (socket) => {
        console.log("User " + socket.id + " connected");

        socket.on("CLIENT_ACCEPT_FRIEND", async (data) => {
            // Xoá id của người gửi kết bạn trong acceptFriends của curentUser
            await User.updateOne(
                {
                    status: "active",
                    _id: currentUser._id,
                },
                {
                    $pull: { acceptFriends: data.userId },
                }
            );
            // Xoá id của currentUser trong requestFriends của người gửi kết bạn
            await User.updateOne(
                {
                    status: "active",
                    _id: data.userId,
                },
                {
                    $pull: { requestFriends: currentUser.id },
                }
            );

            // thêm user_id và room_id vào friendlist của A và B
            await User.updateOne(
                {
                    status: "active",
                    _id: currentUser.id,
                },
                {
                    $push: {
                        friendsList: {
                            user_id: data.userId,
                        },
                    },
                }
            );

            await User.updateOne(
                {
                    status: "active",
                    _id: data.userId,
                },
                {
                    $push: {
                        friendsList: {
                            user_id: currentUser.id,
                        },
                    },
                }
            );
        });

        socket.on("CLIENT_REJECT_FRIEND", async (data) => {
            // Xoá id của người gửi kết bạn trong acceptFriends của curentUser
            await User.updateOne(
                {
                    status: "active",
                    _id: currentUser._id,
                },
                {
                    $pull: { acceptFriends: data.userId },
                }
            );
            // Xoá id của currentUser trong requestFriends của người gửi kết bạn
            await User.updateOne(
                {
                    status: "active",
                    _id: data.userId,
                },
                {
                    $pull: { requestFriends: currentUser.id },
                }
            );
        });
    });

    res.render("../views/pages/users/friendInvitation.pug", {
        pageTitle: "Friend Invitation",
        friendRequests: friendDetailsList,
    });
};
