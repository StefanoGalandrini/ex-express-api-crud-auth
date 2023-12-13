const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validationResult, matchedData } = require("express-validator");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

// index - read all users
async function index(req, res)
{
	const users = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
		},
	});
	res.json(users);
}



// store - create a new user
async function store(req, res)
{
	const { name, email, password, role } = req.body;

	try
	{
		// Verifica se l'email esiste già
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser)
		{
			return res.status(409).json({ message: "Email già in uso." });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role
			},
		});

		const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
			expiresIn: '6h',
		});

		res.status(201).json({
			user: {
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
				role: newUser.role,
			},
			token,
		});
	} catch (error)
	{
		res.status(500).json({ message: "Errore nella creazione dell'utente." });
	}
};




module.exports = {
	index,
	store,
};
