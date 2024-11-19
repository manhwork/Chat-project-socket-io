const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const userValidate = require("../validates/user.validate");

const authRequiredMiddleware = require("../middlewares/auth.middleware");

router.get("/login", controller.index);

router.post("/login", controller.loginPost);

router.get("/register", controller.register);

router.post("/register", userValidate.register, controller.registerPost);

router.get("/logout", controller.logout);

router.get("/info", authRequiredMiddleware.authRequired, controller.getInfo);

router.get(
    "/change/password",
    authRequiredMiddleware.authRequired,
    controller.changePassword
);

module.exports = router;
