const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const generateSlug = require("../utilities/generateSlug");

async function store(req, res, next)
{
	try
	{
		const { name } = req.body;
		const slug = await generateSlug(name);

		const newTag = await prisma.tag.create({
			data: {
				name: name,
				slug: slug
			}
		});

		return res.json(newTag);
	} catch (error)
	{
		next(error);
	}
}

module.exports = {
	store,
};
