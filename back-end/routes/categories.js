const categories = require("../controllers/categories");

const router = require("express").Router();
router.get("/",categories.getAll);
router.get("/level/:level",categories.getByLevel);
router.get("/parent/:parentId",categories.getByParent);
module.exports = router;