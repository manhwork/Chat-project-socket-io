const User = require("../models/user.model");

module.exports.authRequired = async (req, res, next) => {
    const tokenUser = req.cookies.tokenUser;

    if (!tokenUser) {
        res.redirect("/user/login");
        return;
    }

    const user = await User.findOne({
        status: "active",
        token: tokenUser,
    });

    if (!user) {
        res.redirect("/user/login");
        return;
    }

    // Lưu thông tin người dùng và số lượng yêu cầu kết bạn vào biến cục bộ để sử dụng trong các template
    res.locals.userInfo = user;
    res.locals.friendRequestCount = user.acceptFriends.length;

    // Gọi next() để tiếp tục xử lý các middleware khác
    next();
};
