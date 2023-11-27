const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function generateSlug(title)
{
	let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
	let counter = 1;

	while (true)
	{
		const exists = await prisma.post.findUnique({
			where: { slug: slug },
		});

		if (!exists)
		{
			return slug;
		}

		slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${counter}`;
		counter++;
	}
}

module.exports = generateSlug;

// how to use
// async function createPostWithSlug(title)
// {
//	const slug = await generateSlug(title);
// }
