const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validationResult, matchedData } = require("express-validator");

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

	// Hash della password
	const hashedPassword = await bcrypt.hash(password, 10);

	const newUser = await prisma.user.create({
		data: {
			name,
			email,
			role,
			password: hashedPassword,
		},
	});

	res.status(201).json({
		id: newUser.id,
		name: newUser.name,
		email: newUser.email,
		role: newUser.role,
	});
}




module.exports = {
	index,
	store,
};
