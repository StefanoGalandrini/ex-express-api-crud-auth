const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

const { body, checkSchema } = require("express-validator");

const { checkValidity } = require("../middleware/validator");
const postsCreate = require("../validations/postsCreate");
const postsUpdate = require("../validations/postsUpdate");

// const authHandler = require("../middleware/authHandler");
const authRoleHandler = require("../middleware/authRoleHandler");

router.get("/", postsController.index);
router.post("/",
	// authHandler,
	checkSchema(postsCreate),
	checkValidity,
	postsController.create);
router.get("/:slug", postsController.show);
router.put("/:slug",
	// authHandler,
	authRoleHandler("admin"),
	checkSchema(postsUpdate),
	checkValidity,
	postsController.update);
router.delete("/:slug", postsController.destroy);

module.exports = router;
