// import modules
const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const cors = require("cors");

// import errors middleware
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/error404");

// import cors
const corsOptions = {
	origin: process.env.CORS_ORIGIN,
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
	optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// import body-parser
app.use(express.json());

// uploads folder
app.use("/uploads", express.static("uploads"));

// import routers
app.use("/posts", require("./routers/postsRouter"));
app.use("/categories", require("./routers/categoriesRouter"));
app.use("/tags", require("./routers/tagsRouter"));
app.use("/users", require("./routers/usersRouter"));
app.use("", require("./routers/authRouter"));


// import middleware
app.use(notFound);
app.use(errorHandler);

// start server
app.listen(process.env.PORT || 3000, () =>
{
	console.log(`Server running on http://localhost:${process.env.PORT}`);
});
