const User = require("../models/user.model");

module.exports = async (arr) => {
    const result = [];

    if (arr.length > 0) {
        for (const user_id of arr) {
            const user = await User.findOne({
                status: "active",
                _id: user_id,
            });

            if (user) {
                const fullName = user.fullName;
                result.push({
                    userId: user_id,
                    fullName: fullName,
                });
            }
        }
    }
    return result;
};
