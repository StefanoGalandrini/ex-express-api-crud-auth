const AuthError = require("../errors/AuthError");

/**
 * @param {*} role 
 * @returns 
 */
module.exports = function (role)
{
  return function (req, res, next)
  {
    if (req.user.role !== role)
    {
      throw new AuthError("Non hai i permessi per accedere a questa risorsa");
    }

    next();
  };
};
