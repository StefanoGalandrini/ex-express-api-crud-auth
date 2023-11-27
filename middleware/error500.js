module.exports = function (err, req, res, next)
{

	// handle error 500 (internal server error)
	res.format({
		json: () =>
		{
			res.status(500).json({
				message: "Internal server error",
				error: err.message,
				errorInstance: err.name,
			});
		}
	});
};
