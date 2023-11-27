const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const generateSlug = require("../utilities/generateSlug");

async function store(req, res)
{
	try
	{
		const inputData = req.body;
		const slug = await generateSlug(inputData.name);

		const newCategory = await prisma.category.create({
			data: {
				name: inputData.name,
				slug: slug,
			},
		});

		return res.json(newCategory);
	} catch (error)
	{
		return res.status(500).json({ error: error.message });
	}
};

module.exports = {
	store,
};
