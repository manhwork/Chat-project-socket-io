const User = require("../models/user.model");

// Gửi yêu cầu kết bạn
module.exports.sendFriendRequest = async (myUserId, otherUserId) => {
    // thêm id của B vào requestFriends của A tức danh sách gửi lời mời kết bạn A có B
    const existUserBinA = await User.findOne({
        _id: myUserId,
        requestFriends: otherUserId,
    });

    if (!existUserBinA) {
        await User.updateOne(
            {
                _id: myUserId,
                status: "active",
            },
            {
                $push: { requestFriends: otherUserId },
            }
        );
    }
    // thêm id của A vào acceptFriends của B tức là danh sách chờ xác nhận kết bạn của B có A
    const existUserAinB = await User.findOne({
        _id: otherUserId,
        acceptFriends: myUserId,
    });

    if (!existUserAinB) {
        await User.updateOne(
            {
                _id: otherUserId,
                status: "active",
            },
            {
                $push: { acceptFriends: myUserId },
            }
        );
    }
};

// Huỷ yêu cầu kết bạn đã gửi
module.exports.removeFriendRequest = async (myUserId, otherUserId) => {
    // xoa id của B vào requestFriends của A tức danh sách gửi lời mời kết bạn A có B
    const existUserBinA = await User.findOne({
        _id: myUserId,
        requestFriends: otherUserId,
    });

    if (existUserBinA) {
        await User.updateOne(
            {
                _id: myUserId,
                status: "active",
            },
            {
                $pull: { requestFriends: otherUserId },
            }
        );
    }
    // xoa id của A vào acceptFriends của B tức là danh sách chờ xác nhận kết bạn của B có A
    const existUserAinB = await User.findOne({
        _id: otherUserId,
        acceptFriends: myUserId,
    });

    if (existUserAinB) {
        await User.updateOne(
            {
                _id: otherUserId,
                status: "active",
            },
            {
                $pull: { acceptFriends: myUserId },
            }
        );
    }
};

// Từ chối yêu cầu kết bạn (Xoá yêu cầu kết bạn )
module.exports.rejectFriendRequest = async (myUserId, otherUserId) => {
    // Xoá id của currentUser trong requestFriends của người gửi kết bạn
    const existUserBinA = await User.findOne({
        _id: otherUserId,
        requestFriends: myUserId,
    });

    if (existUserBinA) {
        await User.updateOne(
            {
                status: "active",
                _id: otherUserId,
            },
            {
                $pull: { requestFriends: myUserId },
            }
        );
    }
    // Xoá id của người gửi kết bạn trong acceptFriends của curentUser
    const existUserAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: otherUserId,
    });

    if (existUserAinB) {
        await User.updateOne(
            {
                status: "active",
                _id: myUserId,
            },
            {
                $pull: { acceptFriends: otherUserId },
            }
        );
    }
};

// Chấp nhận yêu cầu kết bạn
module.exports.acceptFriendRequest = async (myUserId, otherUserId) => {
    // thêm user_id và room_id vào friendlist của A và B
    const existUserBinA = await User.findOne({
        _id: myUserId,
        "friendsList.user_id": otherUserId,
    });

    // console.log(otherUserId);
    // console.log(myUserId);

    if (!existUserBinA) {
        await User.updateOne(
            {
                status: "active",
                _id: myUserId,
            },
            {
                $push: {
                    friendsList: {
                        user_id: otherUserId,
                    },
                },
            }
        );
    }

    const existUserAinB = await User.findOne({
        _id: otherUserId,
        "friendsList.user_id": myUserId,
    });

    if (!existUserAinB) {
        await User.updateOne(
            {
                status: "active",
                _id: otherUserId,
            },
            {
                $push: {
                    friendsList: {
                        user_id: myUserId,
                    },
                },
            }
        );
    }
};
