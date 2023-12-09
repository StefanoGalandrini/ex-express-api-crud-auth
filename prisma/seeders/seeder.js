const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const generateSlug = require("../../utilities/generateSlug");

const categories = require("../../db/categories.json");
const tags = require("../../db/tags.json");
const users = require("../../db/users.json");
const posts = require("../../db/posts.json");

async function createCategory()
{
	await prisma.category.createMany({
		data: categories.map((category) => ({
			name: category.name,
			slug: generateSlug(category.name)
		})),
	});
};

async function createTag()
{
	await prisma.tag.createMany({
		data: tags.map((tag) => ({
			name: tag.name,
			slug: generateSlug(tag.name)
		})),
	});
};

async function createUsers()
{
	await prisma.user.createMany({
		data: users.map((user) =>
		({
			email: user.email,
			name: user.name,
			role: user.role,
			password: bcrypt.hashSync(user.password, 10),
		})),
	});
};

async function createPosts()
{
	await prisma.post.createMany({
		data: posts.map((post) => ({
			title: post.title,
			slug: generateSlug(post.title),
			author: post.author,
			content: post.content,
			published: post.published,
			userId: Math.floor(Math.random() * 2) + 1,
			categoryId: Math.floor(Math.random() * 5) + 1,
			createdAt: new Date(),
			updatedAt: new Date(),
			tags: {
				connect: post.tags.map((tag) => ({ slug: generateSlug(tag) })),
			},
		})),
	});
};

async function relatePostsToTags()
{
	const allPosts = await prisma.post.findMany();
	const allTags = await prisma.tag.findMany();

	for (const post of allPosts)
	{
		const numberOfTags = Math.floor(Math.random() * 4) + 1;
		const selectedTags = allTags.sort(() => 0.5 - Math.random()).slice(0, numberOfTags);

		await prisma.post.update({
			where: { id: post.id },
			data: {
				tags: {
					connect: selectedTags.map(tag => ({ id: tag.id }))
				}
			}
		});
	}
};

async function seedDatabase()
{
	await createCategory();
	await createTag();
	await createUsers();
	await createPosts();
	await relatePostsToTags();
	await prisma.$disconnect();
}
