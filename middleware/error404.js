const NotFound = require("../errors/NotFound");

const { sendRes } = require("./errorHandler");


module.exports = function (req, res, next)
{
	// return message for error 404 not found
	sendRes(new NotFound("Error 404: page not found"), res);
};
