const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validationResult, matchedData } = require("express-validator");

const generateSlug = require("../utilities/generateSlug");

async function store(req, res)
{
	const validation = validationResult(req);

	if (!validation.isEmpty())
	{
		return res.status(422).json(validation.array());
	}

	const inputData = req.body;
	const slug = await generateSlug(inputData.name);

	const newCategory = await prisma.category.create({
		data: {
			name: inputData.name,
			slug: slug,
		},
	});

	return res.json(newCategory);
}



module.exports = {
	store,
};
