const express = require("express");
const router = express.Router();

const controller = require("../controllers/chat.controller");

router.get("/", controller.index);

router.post("/", controller.messagePost);

router.get("/:room_id", controller.chatFriend);

module.exports = router;
