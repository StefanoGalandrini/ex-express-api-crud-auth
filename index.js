// import modules
const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const errorHandler = require("./middleware/error500");
const notFound = require("./middleware/error404");

// import body-parser
app.use(express.json());

// import routers
app.use("/posts", require("./routers/postsRouter"));
app.use("/categories", require("./routers/categoriesRouter"));
app.use("/tags", require("./routers/tagsRouter"));

// import middleware
app.use(notFound);
app.use(errorHandler);

// start server
app.listen(process.env.PORT || 3000, () =>
{
	console.log(`Server running on http://localhost:${process.env.PORT}`);
});
