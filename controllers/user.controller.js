const User = require("../models/user.model");

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

    const user = new User(req.body);
    await user.save();

    req.flash(
      "success",
      `Đăng kí tài khoản thành công !
                    Vui lòng đăng nhập !
            `
    );
    res.redirect("/user/register");
  } catch (error) {
    req.flash("error", "Tạo tài khoản thất bại !");
    res.redirect("back");
  }
};
