// import Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fs = require("fs");
const path = require("path");
const generateSlug = require("./generateSlug.js");


// async function createCategories()
// {
// 	await prisma.category.create({ data: { name: "Programmazione e Sviluppo Web", slug: generateSlug("Programmazione e Sviluppo Web") } });
// 	await prisma.category.create({ data: { name: "Framework per Frontend e Backend", slug: generateSlug("Framework per Frontend e Backend") } });
// 	await prisma.category.create({ data: { name: "Gestione database relazionali", slug: generateSlug("Gestione database relazionali") } });
// 	await prisma.category.create({ data: { name: "Argomenti di interesse generale", slug: generateSlug("Argomenti di interesse generale") } });
// }




async function main()
{
	// await createCategories();

	const rawData = fs.readFileSync(path.resolve(__dirname, './', 'db', 'db.json'), 'utf8');
	const postsData = JSON.parse(rawData);

	for (const postData of postsData)
	{
		const slug = generateSlug(postData.title);
		const createdPost = await prisma.post.create({
			data: {
				...postData,
				slug: slug,
				categoryId: Math.floor(Math.random() * 4) + 1,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		});
		console.log(`Post creato: ${createdPost.title}`);
	}
}

main();
