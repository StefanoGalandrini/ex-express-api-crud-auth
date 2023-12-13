// handle errors status and message
function sendRes(err, res)
{
	const statusCode = Number(err.status) || 500;
	return res.status(statusCode).json({
		message: err.message,
		error: err.constructor.name,
		errors: err.errors ?? [],
	});
}


module.exports = function (err, req, res, next)
{
	sendRes(err, res);
};


module.exports.sendRes = sendRes;
