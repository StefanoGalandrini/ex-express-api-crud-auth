const express = require("express");
const router = express.Router();
const path = require("path");
const postsController = require("../controllers/postsController");

// Configurazione di Multer
const multer = require("multer");
const storage = multer.diskStorage({
	destination: (req, file, cb) =>
	{
		cb(null, "uploads/");
	},
	filename: (req, file, cb) =>
	{
		cb(null, Date.now() + path.extname(file.originalname));
	}
});
const upload = multer({ storage: storage });


const { body, checkSchema } = require("express-validator");

const { checkValidity } = require("../middleware/validator");
const postsCreate = require("../validations/postsCreate");
const postsUpdate = require("../validations/postsUpdate");

// const authHandler = require("../middleware/authHandler");
const authRoleHandler = require("../middleware/authRoleHandler");

router.get("/", postsController.index);
router.post("/",
	upload.single("image"),
	// authHandler,
	checkSchema(postsCreate),
	checkValidity,
	postsController.create);
router.get("/:slug", postsController.show);
router.patch("/:slug",
	// authHandler,
	// authRoleHandler("admin"),
	checkSchema(postsUpdate),
	checkValidity,
	postsController.update);
router.delete("/:slug", postsController.destroy);

module.exports = router;
