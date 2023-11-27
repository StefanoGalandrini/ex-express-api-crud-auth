// handle errors status and message
function sendRes(err, res)
{
	return res.status(err.status ?? 500).json({
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
