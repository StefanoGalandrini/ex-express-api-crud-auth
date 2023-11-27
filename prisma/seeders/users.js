const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const users = [
	{
		name: "admin",
		email: "admin@email.it",
		password: "Admin00!",
	},
	{
		name: "Stefano Galandrini",
		email: "stefano@email.it",
		password: "Password00!",
	},
];

// Funzione IIFE che si auto invoca all'avvio del file
(async function ()
{
	await prisma.user.createMany({
		data: users.map((user) =>
		{
			user.password = bcrypt.hashSync(user.password, 10);
			return user;
		}),
	});
})();
