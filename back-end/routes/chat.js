const chat = require("../controllers/chat");
const router = require("express").Router();

router.get("/", chat.getChats);
router.get("/messages/:id", chat.getMessages);
router.get("/getAllConnections/:id", chat.getAllConnections);
router.get("/getGroupChats", chat.getGroupChats);
// router.get("/createGroupChat", chat.createGroupChat);

module.exports = router;