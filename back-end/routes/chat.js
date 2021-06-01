const chat = require("../controllers/chat");
const router = require("express").Router();

router.get("/", chat.getChats);
router.get("/messages/:id", chat.getMessages);
// router.post("/createchat", chat.createChat);
// router.post("/addmessage", chat.addMessage);
// router.post("/updatechat", chat.updateChat);

module.exports = router;