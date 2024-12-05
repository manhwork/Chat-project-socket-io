const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const userValidate = require("../validates/user.validate");

const multer = require("multer");

const upload = multer();

const authRequiredMiddleware = require("../middlewares/auth.middleware");

const uploadCloudinaryMiddleware = require("../middlewares/uploadCloudinary.middleware");

router.get("/login", controller.index);

router.post("/login", controller.loginPost);

router.get("/register", controller.register);

router.post("/register", userValidate.register, controller.registerPost);

router.get("/logout", controller.logout);

router.get("/info", authRequiredMiddleware.authRequired, controller.getInfo);

router.post("/info", authRequiredMiddleware.authRequired, controller.postInfo);

router.get(
    "/change/password",
    authRequiredMiddleware.authRequired,
    controller.changePassword
);

router.post(
    "/change/password",
    authRequiredMiddleware.authRequired,
    controller.changePasswordPost
);

router.get(
    "/list-friend",
    authRequiredMiddleware.authRequired,
    controller.getListFriend
);

router.post(
    "/avatar/upload",
    authRequiredMiddleware.authRequired,
    upload.single("avatar"),
    uploadCloudinaryMiddleware.Upload,
    controller.uploadAvatar
);

router.get("/forgot", controller.forgot);

router.post("/forgot", controller.forgotPost);

router.get("/forgot/sendOTP", controller.sendOTP);

router.post("/forgot/sendOTP", controller.sendOTPPost);

module.exports = router;
