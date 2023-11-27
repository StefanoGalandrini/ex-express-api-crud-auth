module.exports = function (req, res, next)
{

	// return message for error 404 not found
	res.format({
		json: () =>
		{
			res.status(404).json({
				message: "Error: page not found"
			});
		}
	});
};
