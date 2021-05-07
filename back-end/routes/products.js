const products = require("../controllers/products");

const router = require("express").Router();
router.get("/:id", products.getByProductId);
router.get("/p/:category", products.getByCategory);
router.get("/:category/:page", products.getByCategoryInPages);
router.get("/:category/:page/:size", products.getByCategoryInPages);
module.exports = router;