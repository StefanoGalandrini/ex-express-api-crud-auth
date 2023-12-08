const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
	destination: function (req, file, cb)
	{
		cb(null, "./uploads/");
	},
	filename: function (req, file, cb)
	{
		cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
	}
});

const upload = multer({ storage: storage });

// upload route
router.post("/upload", upload.single("image"), (req, res) =>
{
	res.json({ file: req.file, message: "File caricato con successo" });
});

module.exports = router;
