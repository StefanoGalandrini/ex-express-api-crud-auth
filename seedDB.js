// import Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fs = require("fs");
const path = require("path");
const generateSlug = require("./generateSlug.js");


async function createCategories()
{
	await prisma.category.create({ data: { name: "Sviluppo Web", slug: generateSlug("Categoria 1") } });
	await prisma.category.create({ data: { name: "Varie", slug: generateSlug("Categoria 2") } });
}




async function main()
{
	await createCategories();

	const rawData = fs.readFileSync(path.resolve(__dirname, './', 'db', 'db.json'), 'utf8');
	const postsData = JSON.parse(rawData);

	for (const postData of postsData)
	{
		const slug = generateSlug(postData.title);
		const createdPost = await prisma.post.create({
			data: {
				...postData,
				slug: slug,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		});
		console.log(`Post creato: ${createdPost.title}`);
	}
}

main();
