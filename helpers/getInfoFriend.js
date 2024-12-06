const User = require("../models/user.model");

module.exports = async function getInfoFriend(arr) {
    const result = [];
    if (arr.length > 0) {
        for (const item of arr) {
            const user = await User.findOne({
                status: "active",
                _id: item.user_id,
            });

            if (user) {
                const fullName = user.fullName;
                const avatar = user.avatar;
                result.push({
                    userId: item.user_id,
                    fullName: fullName,
                    avatar: avatar,
                    room_id: item.room_id,
                });
            }
        }
        return result;
    }
};
