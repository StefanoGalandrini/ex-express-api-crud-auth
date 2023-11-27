const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

const { body, checkSchema } = require("express-validator");

const { checkValidity } = require("../middleware/validator");
const postsCreate = require("../validations/postsCreate");
const postsUpdate = require("../validations/postsUpdate");

router.get("/", postsController.index);
router.post("/", checkSchema(postsCreate), checkValidity, postsController.create);
router.get("/:slug", postsController.show);
router.put("/:slug", checkSchema(postsUpdate), checkValidity, postsController.update);
router.delete("/:slug", postsController.destroy);

module.exports = router;
