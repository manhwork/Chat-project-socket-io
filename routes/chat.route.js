const express = require("express");
const router = express.Router();

const controller = require("../controllers/chat.controller");

router.get("/", controller.index);

router.post("/", controller.message);

module.exports = router;
