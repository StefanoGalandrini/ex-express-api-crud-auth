const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { matchedData } = require("express-validator");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// register function
async function register(req, res, next)
{
	const sanitizedData = matchedData(req);

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = sanitizedData.password = await bcrypt.hash(sanitizedData.password, salt);

	// Creazione dell'utente
	const newUser = await prisma.user.create({
		data: {
			name: sanitizedData.name,
			email: sanitizedData.email,
			password: hashedPassword,
		},
	});

	// generate JWT token
	// @ts-ignore
	const token = jwt.sign(newUser, process.env.JWT_SECRET, {
		expiresIn: "6h",
	});

	// @ts-ignore
	delete newUser.password;

	res.json({
		token,
		user: newUser,
	});
}

async function me(req, res, next)
{
	const user = await prisma.user.findUnique({
		where: {
			id: req.user.id,
		},
	});

	if (!user)
	{
		return res.status(401).json({ error: "User not found" });
	}

	// @ts-ignore
	delete user.password;

	res.json({ user });
}

async function login(req, res, next)
{
	const { email, password } = req.body;

	const user = await prisma.user.findUnique({
		where: {
			email: email,
		},
	});

	if (!user)
	{
		return res.status(401).json({ error: "User not found" });
	}

	const passMatch = await bcrypt.compare(password, user.password);

	if (!passMatch)
	{
		return res.status(401).json({ error: "Wrong password" });
	}

	// generate JWT token
	// @ts-ignore
	const token = jwt.sign(user, process.env.JWT_SECRET, {
		expiresIn: "6h",
	});

	// @ts-ignore
	delete user.password;

	res.json({
		token,
		user,
	});
}

async function verifyToken(req, res)
{
	const { token } = req.body;

	if (!token)
	{
		return res.status(401).json({ message: "Token non fornito" });
	}

	try
	{
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await prisma.user.findUnique({
			where: { id: decoded.id },
			select: { id: true, email: true, name: true, /* altri campi che vuoi restituire */ }
		});

		if (!user)
		{
			return res.status(404).json({ message: "Utente non trovato" });
		}

		res.json({ user });
	} catch (error)
	{
		res.status(401).json({ message: "Token non valido" });
	}
};


module.exports = {
	register,
	login,
	me,
	verifyToken,
};
