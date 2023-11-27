/**
 * @type {import("express-validator").Schema}
 */
module.exports = {
	title: {
		in: ["body"],
		notEmpty: {
			errorMessage: "Title is required",
		},
		isString: {
			errorMessage: "Title must be a string",
		},
	},
	content: {
		in: ["body"],
		notEmpty: {
			errorMessage: "Content is required",
		},
		isString: {
			errorMessage: "Content must be a string",
		},
	},
	published: {
		in: ["body"],
		notEmpty: {
			errorMessage: "Published is required",
		},
		isBoolean: {
			errorMessage: "Published must be true or false",
		},
	},
};
