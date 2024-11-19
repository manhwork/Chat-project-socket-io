const User = require("../models/user.model");

// [GET]  /user/login
module.exports.index = async (req, res) => {
    res.render("../views/login.pug", {
        pageTitle: "Login",
    });
};

// [GET] /user/register

module.exports.register = async (req, res) => {
    res.render("../views/register.pug", {
        pageTitle: "Register",
    });
};

// [POST] /user/register

module.exports.registerPost = async (req, res) => {
    console.log(req.body);
    const user = new User(req.body);
    // console.log(user);
    res.send("ok");
};
