const User = require("../models/user.model");
const getInfoFriendDetailHelper = require("../helpers/getInfoFriendDetail");

// [GET]  /user/login
module.exports.index = async (req, res) => {
    res.render("../views/login.pug", {
        pageTitle: "Login",
    });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        status: "active",
        email: email,
    });

    if (!user) {
        req.flash("error", "Không tìm thấy email này !");
        res.redirect("back");
        return;
    }

    if (password !== user.password) {
        req.flash("error", "Mật khẩu không chính xác !");
        res.redirect("back");
        return;
    }

    const tokenUser = user.token;
    res.cookie("tokenUser", tokenUser);

    req.flash("success", "Đăng nhập thành công !");
    res.redirect("/chats");
};

// [GET] /user/register

module.exports.register = async (req, res) => {
    res.render("../views/register.pug", {
        pageTitle: "Register",
    });
};

// [POST] /user/register

module.exports.registerPost = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        const existEmail = await User.findOne({
            status: "active",
            email: email,
        });

        if (existEmail) {
            req.flash("error", "Email đã tồn tại !");
            res.redirect("back");
            return;
        }

        if (password !== confirmPassword) {
            req.flash("error", "Mật khẩu không trùng khớp !");
            res.redirect("back");
            return;
        }

        req.body.fullName = email;

        const user = new User(req.body);
        await user.save();

        req.flash(
            "success",
            `Đăng kí tài khoản thành công !
                    Vui lòng đăng nhập !
            `
        );
        res.redirect("/user/login");
    } catch (error) {
        req.flash("error", "Tạo tài khoản thất bại !");
        res.redirect("back");
    }
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/user/login");
};

// [GET] /user/info

module.exports.getInfo = async (req, res) => {
    res.render("../views/pages/user/info.pug", {
        pageTitle: "InfoUser",
    });
};

// [POST] /user/info

module.exports.postInfo = async (req, res) => {
    const email = req.body.email;
    try {
        const tokenUser = req.cookies.tokenUser;

        const existEmail = await User.findOne({
            email: email,
            token: { $ne: tokenUser },
        });

        if (existEmail) {
            req.flash("error", "Email đã tồn tài !");
            res.redirect("back");
            return;
        }

        await User.updateOne(
            {
                status: "active",
                token: tokenUser,
            },
            req.body
        );

        req.flash("success", "Cập nhật thành công !");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Cập nhật thất bại !");
        res.redirect("back");
    }
};

// [GET] /user/change/password

module.exports.changePassword = async (req, res) => {
    res.render("../views/pages/user/changpassword", {
        pageTitle: "ChangePassword",
    });
};

// [POST] /user/change/password

module.exports.changePasswordPost = async (req, res) => {
    const user = res.locals.userInfo;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (oldPassword !== user.password) {
        req.flash("error", "Mật khẩu cũ không chính xác !");
        res.redirect("back");
        return;
    }

    if (oldPassword === newPassword) {
        req.flash("error", "Vui lòng nhập mật khẩu mới khác mật khẩu cũ !");
        res.redirect("back");
        return;
    }

    if (newPassword !== confirmPassword) {
        req.flash("error", "Mật khẩu không trùng khớp !");
        res.redirect("back");
        return;
    }

    await User.updateOne(
        {
            token: user.token,
        },
        {
            password: newPassword,
        }
    );

    req.flash("success", "Cập nhật mật khẩu mới thành công !");
    res.redirect("/user/change/password");
};

// [GET] /user/list-friend

module.exports.getListFriend = async (req, res) => {
    const user = res.locals.userInfo;
    const friendsList = user.friendsList;

    async function getInfoFriend(arr) {
        const result = [];
        if (arr.length > 0) {
            for (const item of arr) {
                const user = await User.findOne({
                    status: "active",
                    _id: item.user_id,
                });

                if (user) {
                    const fullName = user.fullName;
                    result.push({
                        userId: item.user_id,
                        fullName: fullName,
                    });
                }
            }
            return result;
        }
    }

    const friendsListInfo = await getInfoFriend(friendsList);

    res.render("../views/pages/user/listFriend.pug", {
        pageTitle: "Danh sách bạn bè",
        friendsListInfo: friendsListInfo,
    });
};
