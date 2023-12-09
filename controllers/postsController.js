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
		const tagIds = tags.map(tagId => parseInt(tagId));


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
				tags: {
					connect: tagIds.map(id => ({ id }))
				}
			},
			include: {
				category: true,
				tags: true,
			},
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
		return next(new validationError("Controllare i dati inseriti", validation.array()));
	}

	const { slug } = req.params;
	let updateData = {};

	const article = await prisma.post.findUnique({
		where: { slug },
		include: {
			category: true,
			tags: true,
		},
	});

	if (!article)
	{
		return next(new NotFound(`Post not found with slug: ${slug}`));
	}

	// Gestisci i campi di testo da FormData
	if (req.body.title)
	{
		updateData.title = req.body.title;
		updateData.slug = await generateSlug(req.body.title);
	}

	if (req.body.author)
	{
		updateData.author = req.body.author;
	}

	if (req.body.content)
	{
		updateData.content = req.body.content;
	}

	if (req.body.published)
	{
		updateData.published = req.body.published === 'true';
	}

	if (req.body.categoryId)
	{
		updateData.categoryId = parseInt(req.body.categoryId);
	}

	// Gestisci i tag
	if (req.body.tags)
	{
		const tagIds = req.body.tags.map(id => parseInt(id));
		const existingTagIds = article.tags.map(tag => tag.id);
		const tagsToDisconnect = existingTagIds.filter(id => !tagIds.includes(id));
		const tagsToConnect = tagIds.filter(id => !existingTagIds.includes(id));

		updateData.tags = {
			disconnect: tagsToDisconnect.map(id => ({ id })),
			connect: tagsToConnect.map(id => ({ id })),
		};
	}

	// Gestisci l'immagine
	if (req.file)
	{
		if (article.image)
		{
			try
			{
				fs.unlink(article.image, (error) =>
				{
					if (error)
					{
						console.log("Errore nella rimozione dell'immagine esistente:", error);
					}
				});
			} catch (error)
			{
				console.log("Errore nella rimozione dell'immagine esistente:", error);
			}
		}
		updateData.image = req.file.path;
	}

	// Esegui l'aggiornamento
	try
	{
		const updatedPost = await prisma.post.update({
			where: { slug },
			data: updateData,
			include: {
				category: true,
				tags: true,
			},
		});

		res.json(updatedPost);
	} catch (error)
	{
		console.error(error);
		res.status(500).send("Errore durante l'aggiornamento dell'articolo");
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
