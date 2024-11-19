module.exports.register = async (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", "Vui lòng điền email!");
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Vui lòng điền mật khẩu !");
        res.redirect("back");
        return;
    }
    if (req.body.password.length < 6) {
        req.flash("error", "Vui lòng điền mật khẩu tối thiểu 6 kí tự !");
        res.redirect("back");
        return;
    }
    if (!req.body.confirmPassword) {
        req.flash("error", "Vui lòng điền xác nhận mật khẩu !");
        res.redirect("back");
        return;
    }
    if (req.body.confirmPassword.length < 6) {
        req.flash(
            "error",
            "Vui lòng điền xác nhận mật khẩu tối thiểu 6 kí tự !"
        );
        res.redirect("back");
        return;
    }
    next();
};
