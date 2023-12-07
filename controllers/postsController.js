const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const generateSlug = require("../utilities/generateSlug");

// errors handler
const NotFound = require("../errors/NotFound");
const validationError = require("../errors/ValidationError");
const { validationResult } = require("express-validator");


// index - read all posts
/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function index(req, res, next)
{
	try
	{
		const { published, string } = req.query;
		let queryOptions = {};
		if (published)
		{
			queryOptions.where = {
				...queryOptions.where,
				published: published === "true"
			};
		}

		if (string)
		{
			queryOptions.where = {
				...queryOptions.where,
				OR: [
					{
						title: {
							contains: string,
						}
					},
					{
						content: {
							contains: string,
						}
					},
				],
			};
		}

		const posts = await prisma.post.findMany({
			...queryOptions,
			include: {
				user: true,
				category: true,
				tags: true,
			},
		});
		res.json(posts);
	} catch (error)
	{
		next(error);
	}
}


// create - create a new post
/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function create(req, res, next)
{
	const validation = validationResult(req);
	if (!validation.isEmpty())
	{
		return next(
			new validationError("verificare i dati inseriti", validation.array())
		);
	}

	const { title, author, image, content, published } = req.body;
	const slug = await generateSlug(title);

	const newPost = await prisma.post.create({
		data: {
			title,
			slug,
			author,
			image,
			content,
			published,
			categoryId: req.body.categoryId,
			userId: 1,
			tags: {
				connect: req.body.tags.map(tag => ({ id: tag.id })),
			},
		},
		include: {
			category: true,
			tags: true,
		}
	});

	res.json(newPost);
}


// show - read a single post by slug
/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function show(req, res, next)
{
	const { slug } = req.params;
	const post = await prisma.post.findUnique({
		where: { slug: slug },
		include: {
			category: true,
			tags: true,
		},
	});

	if (!post)
	{
		next(new NotFound(`Post with slug ${slug} not found`));
	}

	res.json(post);
}


// update - update a single post by slug
/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function update(req, res, next)
{
	const validation = validationResult(req);
	if (!validation.isEmpty())
	{
		return next(
			new validationError("Controllare i dati inseriti", validation.array())
		);
	}

	const { slug } = req.params;
	let updateData = req.body;

	const post = await prisma.post.findUnique({
		where: {
			slug: slug,
		},
	});

	if (!post)
	{
		throw new Error(`Post not found with slug: ${slug}`);
	}

	if (req.body.title)
	{
		updateData.slug = await generateSlug(req.body.title);
	}

	// update category
	if (req.body.categoryId)
	{
		updateData.categoryId = req.body.categoryId;
	}

	// update tags
	if (req.body.tags)
	{
		updateData.tags = {
			set: [],
			connect: req.body.tags.map(tag => ({ id: tag.id })),
		};
	}

	const updatedPost = await prisma.post.update({
		where: { slug: slug },
		data: updateData,
		include: {
			category: true,
			tags: true,
		},
	});

	res.json(updatedPost);
}




// delete - delete a single post by slug
/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function destroy(req, res, next)
{
	const { slug } = req.params;

	await prisma.post.delete({
		where: { slug }
	});

	return res.json({ message: "Post successfully deleted" });
}



module.exports = {
	index,
	create,
	show,
	update,
	destroy
};
