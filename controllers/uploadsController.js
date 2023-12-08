const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const path = require("path");
const { sendRes } = require("../middleware/errorHandler");

// Configurazione di Multer
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

exports.uploadImage = upload.single("image");

exports.handleUpload = async (req, res) =>
{
	if (!req.file)
	{
		return res.status(400).send("Nessun file caricato.");
	}
	try
	{
		const postSlug = req.body.postSlug;
		const imagePath = req.file.path;
		const updatedPost = await prisma.post.update({
			where: { slug: postSlug },
			data: { image: imagePath },
		});
		res.send({ message: 'File caricato con successo', updatedPost });
	} catch (error)
	{
		sendRes(error, res);
	}
};
