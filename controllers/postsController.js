const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const generateSlug = require("../utilities/generateSlug");

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
	try
	{
		const { title, image, content, published } = req.body;
		const slug = await generateSlug(title);

		const newPost = await prisma.post.create({
			data: {
				title,
				slug,
				image,
				content,
				published,
				categoryId: req.body.categoryId,
				tags: {
					connect: req.body.tags,
				},
			},
			include: {
				category: true,
				tags: true,
			}
		});

		res.json(newPost);
	} catch (error)
	{
		next(error);
	}
}


// show - read a single post by slug
/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function show(req, res, next)
{
	try
	{
		const { slug } = req.params;
		const post = await prisma.post.findUnique({
			where: { slug: slug },
			include: {
				category: true,
				tags: true,
			},
		});

		if (post)
		{
			res.json(post);
		} else
		{
			res.status(404).json({ error: `Post with slug ${slug} not found` });
		}
	} catch (error)
	{
		next(error);
	}
}


// update - update a single post by slug
/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function update(req, res, next)
{
	try
	{
		const { slug } = req.params;
		let updateData = req.body;

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
				connect: req.body.tags,
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
	} catch (error)
	{
		next(error);
	}
}




// delete - delete a single post by slug
/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function destroy(req, res, next)
{
	try
	{
		const { slug } = req.params;

		await prisma.post.delete({
			where: { slug }
		});

		res.status(200).json({ message: "Post successfully deleted" });
	} catch (error)
	{
		next(error);
	}
}





module.exports = {
	index,
	create,
	show,
	update,
	destroy
};
