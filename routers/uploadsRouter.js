const express = require("express");
const router = express.Router();
const uploadsController = require("../controllers/uploadsController");

router.post("/", uploadsController.uploadImage, uploadsController.handleUpload);

module.exports = router;
