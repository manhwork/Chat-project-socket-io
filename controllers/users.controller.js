const User = require("../models/user.model");

// [GET] /user/not-friend

module.exports.index = async (req, res) => {
    const userId = res.locals.userInfo._id;

    const users = await User.find({
        status: "active",
        _id: { $ne: userId },
    }).select("_id fullName");

    res.render("../views/pages/users/index.pug", {
        pageTitle: "Danh sách người dùng",
        users: users,
    });
};
