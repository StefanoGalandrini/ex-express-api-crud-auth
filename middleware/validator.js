const { validationResult, checkSchema, matchedData } = require('express-validator');

function checkValidity(req, res, next)
{
	const validate = validationResult(req);
	if (!validate.isEmpty())
	{
		return res.status(422).json(validate.array());
	}

	req.validateData = matchedData(req);

	next();
}


module.exports = function (schema)
{
	return [
		checkSchema(schema),
		checkValidity,
	];
};


module.exports.checkValidity = checkValidity;
