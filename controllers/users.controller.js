const User = require("../models/user.model");
const getInfoFriendDetailHelper = require("../helpers/getInfoFriendDetail");
const friendRequestHelper = require("../helpers/friendRequests");

// [GET] /user/not-friend

module.exports.index = async (req, res) => {
    const myUserId = res.locals.userInfo.id;
    const myUser = res.locals.userInfo;
    const friendsList = myUser.friendsList.map((friend) => friend.user_id);

    // Lọc ra tất cả các người dùng trừ người dùng đã kết bạn
    const users = await User.find({
        status: "active",
        _id: { $nin: [...friendsList, myUserId] },
    });

    _io.once("connection", (socket) => {
        console.log("User " + socket.id + " connected");

        socket.on("CLIENT_SEND_SENT_FRIEND", async (data) => {
            const otherUserId = data.notFriendId;

            await friendRequestHelper.sendFriendRequest(myUserId, otherUserId);
        });

        socket.on("CLIENT_SEND_CANCEL_SENT_FRIEND", async (data) => {
            const otherUserId = data.notFriendId;

            await friendRequestHelper.removeFriendRequest(
                myUserId,
                otherUserId
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
    const myUser = res.locals.userInfo;

    const pendingFriendRequests = myUser.acceptFriends;

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
            const otherUserId = data.userId;

            // Xoá lời mời kết bạn
            await friendRequestHelper.rejectFriendRequest(
                myUser.id,
                otherUserId
            );

            // thêm vào danh sách bạn bè
            await friendRequestHelper.acceptFriendRequest(
                myUser.id,
                otherUserId
            );
        });

        socket.on("CLIENT_REJECT_FRIEND", async (data) => {
            const otherUserId = data.userId;

            await friendRequestHelper.rejectFriendRequest(
                myUser.id,
                otherUserId
            );
        });
    });

    res.render("../views/pages/users/friendInvitation.pug", {
        pageTitle: "Friend Invitation",
        friendRequests: friendDetailsList,
    });
};
