const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const userValidate = require("../validates/user.validate");

router.get("/login", controller.index);

router.get("/register", controller.register);

router.post("/register", userValidate.register, controller.registerPost);

module.exports = router;
