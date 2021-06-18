const router = require("express").Router();
const login = require("../controllers/login");
const {
    authorized
} = require("../middleware/authenticate");

router.post("/register", login.register);
router.post("/login", login.login);
router.get("/profile", authorized, login.getProfile);
router.get("/getusername", login.getusername);
router.get("/getemail", login.getemail);
router.get("/checkroute", login.getUsers);

module.exports = router;