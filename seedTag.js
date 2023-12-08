const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fs = require("fs");
const path = require("path");
const generateSlug = require("./generateSlug.js");


async function createTags()
{
	await prisma.tag.create({ data: { name: "Frontend", slug: generateSlug("Frontend") } });
	await prisma.tag.create({ data: { name: "Backend", slug: generateSlug("Backend") } });
	await prisma.tag.create({ data: { name: "HTML/CSS", slug: generateSlug("HTML/CSS") } });
	await prisma.tag.create({ data: { name: "PHP", slug: generateSlug("PHP") } });
	await prisma.tag.create({ data: { name: "MySql", slug: generateSlug("MySql") } });
	await prisma.tag.create({ data: { name: "Vue JS", slug: generateSlug("Vue JS") } });
	await prisma.tag.create({ data: { name: "React", slug: generateSlug("React") } });
	await prisma.tag.create({ data: { name: "Laravel", slug: generateSlug("Laravel") } });
	await prisma.tag.create({ data: { name: "Express JS", slug: generateSlug("Express JS") } });
	await prisma.tag.create({ data: { name: "Node Js", slug: generateSlug("Node JS") } });
	await prisma.tag.create({ data: { name: "JavaScript", slug: generateSlug("JavaScript") } });
}



createTags();
