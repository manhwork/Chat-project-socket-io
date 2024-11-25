const User = require("../models/user.model");

// Gửi yêu cầu kết bạn
module.exports.sendFriendRequest = async (currentUserId, otherUserId) => {
    // thêm id của B vào requestFriends của A tức danh sách gửi lời mời kết bạn A có B
    await User.updateOne(
        {
            _id: currentUserId,
            status: "active",
        },
        {
            $push: { requestFriends: otherUserId },
        }
    );
    // thêm id của A vào acceptFriends của B tức là danh sách chờ xác nhận kết bạn của B có A
    await User.updateOne(
        {
            _id: otherUserId,
            status: "active",
        },
        {
            $push: { acceptFriends: currentUserId },
        }
    );
};

// Huỷ yêu cầu kết bạn đã gửi
module.exports.removeFriendRequest = async (currentUserId, otherUserId) => {
    // xoa id của B vào requestFriends của A tức danh sách gửi lời mời kết bạn A có B
    await User.updateOne(
        {
            _id: currentUserId,
            status: "active",
        },
        {
            $pull: { requestFriends: otherUserId },
        }
    );
    // xoa id của A vào acceptFriends của B tức là danh sách chờ xác nhận kết bạn của B có A
    await User.updateOne(
        {
            _id: otherUserId,
            status: "active",
        },
        {
            $pull: { acceptFriends: currentUserId },
        }
    );
};

// Từ chối yêu cầu kết bạn (Xoá yêu cầu kết bạn )
module.exports.rejectFriendRequest = async (currentUserId, otherUserId) => {
    // Xoá id của currentUser trong requestFriends của người gửi kết bạn
    await User.updateOne(
        {
            status: "active",
            _id: otherUserId,
        },
        {
            $pull: { requestFriends: currentUserId },
        }
    );
    // Xoá id của người gửi kết bạn trong acceptFriends của curentUser
    await User.updateOne(
        {
            status: "active",
            _id: currentUserId,
        },
        {
            $pull: { acceptFriends: otherUserId },
        }
    );
};

// Chấp nhận yêu cầu kết bạn
module.exports.acceptFriendRequest = async (currentUserId, otherUserId) => {
    // thêm user_id và room_id vào friendlist của A và B
    await User.updateOne(
        {
            status: "active",
            _id: currentUserId,
        },
        {
            $push: {
                friendsList: {
                    user_id: otherUserId,
                },
            },
        }
    );

    await User.updateOne(
        {
            status: "active",
            _id: otherUserId,
        },
        {
            $push: {
                friendsList: {
                    user_id: currentUserId,
                },
            },
        }
    );
};
