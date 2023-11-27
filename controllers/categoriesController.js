const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const generateSlug = require("../utilities/generateSlug");

async function store(req, res)
{
	const inputData = req.body;
	const slug = await generateSlug(inputData.name);

	const newCategory = await prisma.category.create({
		data: {
			name: inputData.name,
			slug: slug,
		},
		include: {
			posts: true,
		}
	});

	return res.json(newCategory);
}

module.exports = {
	store,
};
