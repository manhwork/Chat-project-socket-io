const User = require("../models/user.model");

module.exports.authRequired = async (req, res, next) => {
    const tokenUser = req.cookies.tokenUser;

    const user = await User.findOne({
        status: "active",
        token: tokenUser,
    });

    if (!tokenUser || !user) {
        res.redirect("/user/login");
        return;
    }

    res.locals.userInfo = user;
    res.locals.friendRequestCount = user.acceptFriends.length;

    next();
};
