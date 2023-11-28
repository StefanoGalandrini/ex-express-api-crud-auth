const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const generateSlug = require("../utilities/generateSlug");

// index - read all tags
async function index(req, res)
{
	const tags = await prisma.tag.findMany();
	res.json(tags);
}


// store - create a new tag
async function store(req, res)
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
};


module.exports = {
	index,
	store,
};
