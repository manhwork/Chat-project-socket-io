const User = require("../models/user.model");
const md5 = require("md5");
const Otp = require("../models/otp.model");

const getInfoFriendHelper = require("../helpers/getInfoFriend");
const generateRandomHelper = require("../helpers/generateRandom");
const sendOTPHelper = require("../helpers/sendOTP");

// [GET]  /user/login
module.exports.index = async (req, res) => {
    res.render("../views/login.pug", {
        pageTitle: "Đăng nhập",
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

    if (md5(password) !== user.password) {
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
        pageTitle: "Đăng kí",
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

        // Mã hóa password md5
        req.body.password = md5(req.body.password);

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
        pageTitle: "Thông tin người dùng",
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
        pageTitle: "Thay đổi mật khẩu",
    });
};

// [POST] /user/change/password

module.exports.changePasswordPost = async (req, res) => {
    const user = res.locals.userInfo;
    let { oldPassword, newPassword, confirmPassword } = req.body;

    oldPassword = md5(oldPassword);
    newPassword = md5(newPassword);
    confirmPassword = md5(confirmPassword);

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
    const myUser = res.locals.userInfo;
    const friendsList = myUser.friendsList;

    _io.once("connection", (socket) => {
        console.log("User " + socket.id + " connected");

        socket.on("CLIENT_SEND_CANCEL_FRIEND_IN_LIST", async (data) => {
            // Lấy đồng thời userId trong listfriend của cả 2 người
            await Promise.all([
                User.updateOne(
                    {
                        status: "active",
                        _id: myUser.id,
                    },
                    {
                        $pull: {
                            friendsList: {
                                user_id: data.userId,
                            },
                        },
                    }
                ),

                User.updateOne(
                    {
                        status: "active",
                        _id: data.userId,
                    },
                    {
                        $pull: {
                            friendsList: {
                                user_id: myUser.id,
                            },
                        },
                    }
                ),
            ]);
        });
    });

    const friendsListInfo = await getInfoFriendHelper(friendsList);

    res.render("../views/pages/user/listFriend.pug", {
        pageTitle: "Danh sách bạn bè",
        friendsListInfo: friendsListInfo,
    });
};

//  [GET] /user/avatar/upload

module.exports.uploadAvatar = async (req, res) => {
    try {
        const myUserId = res.locals.userInfo.id;
        const originalFolder = "/uploads/";

        const filename = req.file.filename;

        const path = originalFolder + filename;

        await User.updateOne(
            {
                _id: myUserId,
                status: "active",
            },
            {
                avatar: req.body.avatar,
            }
        );
        req.flash("success", "Cập nhật avatar thành công !");
        res.redirect("/user/info");
    } catch (error) {
        req.flash("error", "Cập nhật avatar thất bại !");
        res.redirect("/user/info");
    }
};

// [GET] /user/forgot
module.exports.forgot = async (req, res) => {
    res.render("../views/pages/user/forgot.pug");
};

// [POST] /user/forgot
module.exports.forgotPost = async (req, res) => {
    const email = req.body.email;
    const otp = generateRandomHelper.generateRandomNumber(6);

    const existUser = await User.findOne({
        status: "active",
        email: email,
    });

    if (!existUser) {
        req.flash("error", "Email không tồn tại !");
        res.redirect("/user/forgot");
        return;
    }

    const otpObject = {
        email: email,
        otp: otp,
        expireAt: new Date(Date.now() + 3 * 60 * 1000), // hạn là 3 phút
    };

    const otpModel = new Otp(otpObject);
    await otpModel.save();

    // Mailer gửi otp đến gmail
    const nodemailer = require("nodemailer");

    // Tạo transporter sử dụng dịch vụ Gmail
    sendOTPHelper(email, otp);
    // End Mailer gửi otp đến gmail

    res.cookie("email", email);
    req.flash(
        "success",
        "Mã OTP đã được gửi về email của bạn vui lòng kiểm tra trong hộp thư !"
    );

    res.redirect("/user/forgot/sendOTP");
};

// [GET] /user/forgot/sendOTP
module.exports.sendOTP = async (req, res) => {
    res.render("../views/pages/user/sendOTP.pug");
};

// [POST] /user/forgot/sendOTP
module.exports.sendOTPPost = async (req, res) => {
    const email = req.cookies.email;
    const otp = req.body.otp;
    const existOTP = await Otp.findOne({
        email: email,
        otp: otp,
    });

    if (!existOTP) {
        req.flash("error", "Mã OTP không chính xác !");
        res.redirect("/user/forgot/sendOTP");
        return;
    }

    req.flash("success", "Mã OTP hợp lệ !");

    res.redirect("/user/forgot/change/password");
};
