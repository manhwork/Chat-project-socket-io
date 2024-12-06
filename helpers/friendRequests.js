const User = require("../models/user.model");

// Gửi yêu cầu kết bạn
module.exports.sendFriendRequest = async (myUserId, otherUserId) => {
    // Kiểm tra xem lời mời kết bạn đã tồn tại hay chưa
    const [myUser, otherUser] = await Promise.all([
        // Kiểm tra xem user A đã gửi lời mời kết bạn tới user B chưa
        User.findOne({ _id: myUserId, requestFriends: otherUserId }),
        // Kiểm tra xem user B đã chấp nhận lời mời kết bạn của user A chưa
        User.findOne({ _id: otherUserId, acceptFriends: myUserId }),
    ]);

    if (!myUser && !otherUser) {
        // Thêm id của user B vào danh sách lời mời kết bạn của user A
        // Thêm id của user A vào danh sách chấp nhận kết bạn của user B
        await Promise.all([
            User.updateOne(
                { _id: myUserId, status: "active" },
                { $push: { requestFriends: otherUserId } }
            ),
            User.updateOne(
                { _id: otherUserId, status: "active" },
                { $push: { acceptFriends: myUserId } }
            ),
        ]);
    }
};

// Huỷ yêu cầu kết bạn đã gửi
module.exports.removeFriendRequest = async (myUserId, otherUserId) => {
    // Kiểm tra xem lời mời kết bạn đã tồn tại hay chưa
    const [myUser, otherUser] = await Promise.all([
        // Kiểm tra xem user A đã gửi lời mời kết bạn tới user B chưa
        User.findOne({ _id: myUserId, requestFriends: otherUserId }),
        // Kiểm tra xem user B đã chấp nhận lời mời kết bạn của user A chưa
        User.findOne({ _id: otherUserId, acceptFriends: myUserId }),
    ]);

    if (myUser && otherUser) {
        // Xoá id của user B khỏi danh sách lời mời kết bạn của user A
        // Xoá id của user A khỏi danh sách chấp nhận kết bạn của user B
        await Promise.all([
            User.updateOne(
                { _id: myUserId, status: "active" },
                { $pull: { requestFriends: otherUserId } }
            ),
            User.updateOne(
                { _id: otherUserId, status: "active" },
                { $pull: { acceptFriends: myUserId } }
            ),
        ]);
    }
};

// Từ chối yêu cầu kết bạn
module.exports.rejectFriendRequest = async (myUserId, otherUserId) => {
    // Kiểm tra xem lời mời kết bạn đã tồn tại hay chưa
    const [myUser, otherUser] = await Promise.all([
        // Kiểm tra xem user B đã gửi lời mời kết bạn tới user A chưa
        User.findOne({ _id: otherUserId, requestFriends: myUserId }),
        // Kiểm tra xem user A đã chấp nhận lời mời kết bạn của user B chưa
        User.findOne({ _id: myUserId, acceptFriends: otherUserId }),
    ]);

    if (myUser && otherUser) {
        // Xoá id của user A khỏi danh sách lời mời kết bạn của user B
        // Xoá id của user B khỏi danh sách chấp nhận kết bạn của user A
        await Promise.all([
            User.updateOne(
                { _id: otherUserId, status: "active" },
                { $pull: { requestFriends: myUserId } }
            ),
            User.updateOne(
                { _id: myUserId, status: "active" },
                { $pull: { acceptFriends: otherUserId } }
            ),
        ]);
    }
};

// Chấp nhận yêu cầu kết bạn
module.exports.acceptFriendRequest = async (myUserId, otherUserId, room_id) => {
    // Kiểm tra xem hai người dùng đã là bạn bè hay chưa
    const [myUser, otherUser] = await Promise.all([
        // Kiểm tra danh sách bạn bè của user A xem có user B chưa
        User.findOne({ _id: myUserId, "friendsList.user_id": otherUserId }),
        // Kiểm tra danh sách bạn bè của user B xem có user A chưa
        User.findOne({ _id: otherUserId, "friendsList.user_id": myUserId }),
    ]);

    if (!myUser && !otherUser) {
        // Thêm id của user B vào danh sách bạn bè của user A
        // Thêm id của user A vào danh sách bạn bè của user B
        await Promise.all([
            User.updateOne(
                { _id: myUserId, status: "active" },
                {
                    $push: {
                        friendsList: {
                            user_id: otherUserId,
                            room_id: room_id,
                        },
                    },
                }
            ),
            User.updateOne(
                { _id: otherUserId, status: "active" },
                {
                    $push: {
                        friendsList: {
                            user_id: myUserId,
                            room_id: room_id,
                        },
                    },
                }
            ),
        ]);
    }
};
