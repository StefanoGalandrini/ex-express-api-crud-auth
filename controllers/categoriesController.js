const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validationResult, matchedData } = require("express-validator");

const generateSlug = require("../utilities/generateSlug");

// index - read all categories
async function index(req, res)
{
	const categories = await prisma.category.findMany();
	res.json(categories);
}



// store - create a new category
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
	index,
	store,
};
