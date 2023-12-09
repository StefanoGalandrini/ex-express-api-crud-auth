const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const generateSlug = require("../utilities/generateSlug");
const fs = require("fs");
const util = require("util");
// const unlinkFile = util.promisify(fs.unlink);


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
		return next(new validationError("Verificare i dati inseriti", validation.array()));
	}
	try
	{
		const { title, content, published, author, categoryId, tags } = req.body;
		const imagePath = req.file ? req.file.path : null;
		slug = await generateSlug(title);
		console.log(req.file);

		// Creazione del post
		const cat = parseInt(categoryId);
		const post = await prisma.post.create({
			data: {
				title,
				slug,
				content,
				published: published === 'true',
				author,
				image: imagePath,
				categoryId: cat,
				// tags: {
				// 	connect: tags.map(tag => ({ id: tag.id })) // Collega i tag esistenti
				// }
			}
		});

		res.status(201).json({ message: "Post creato con successo", post });
	} catch (error)
	{
		console.error(error);
		res.status(500).send("Errore nella creazione del post");
	}
};



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
		where: { slug },
		include: {
			category: true,
			tags: true,
		},
	});

	if (!post)
	{
		return next(new NotFound(`Post not found with slug: ${slug}`));
	}


	// update image
	If(updateData.image && post.image !== updateData.image);
	{
		if (post.image)
		{
			try
			{
				await unlinkAsync(post.image);
			} catch (error)
			{
				console.log("Errore nella rimozione dell'immagine esistente:", error);
			}
		}
	}

	// update title and slug
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
		// Ottenere gli ID dei tag esistenti
		const existingTagIds = post.tags.map(tag => tag.id);
		// Ottenere gli ID dei nuovi tag da req.body
		const newTagIds = req.body.tags.map(tag => tag.id);

		// Determinare quali tag devono essere disaccoppiati e quali collegati
		const tagsToDisconnect = existingTagIds.filter(id => !newTagIds.includes(id));
		const tagsToConnect = newTagIds.filter(id => !existingTagIds.includes(id));

		updateData.tags = {
			disconnect: tagsToDisconnect.map(id => ({ id })),
			connect: tagsToConnect.map(id => ({ id })),
		};
	}

	const updatedPost = await prisma.post.update({
		where: { slug },
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
	const post = await prisma.post.findUnique({
		where: { slug },
	});

	if (!post)
	{
		return next(new NotFound(`Post not found with slug: ${slug}`));
	}

	if (post.image)
	{
		fs.unlink(post.image, (error) =>
		{
			if (error)
			{
				console.log("Errore nella rimozione dell'immagine esistente:", error);
			}
		});
	}

	await prisma.post.delete({
		where: { slug }
	});

	res.json({ message: "Post successfully deleted" });
}



module.exports = {
	index,
	create,
	show,
	update,
	destroy
};
