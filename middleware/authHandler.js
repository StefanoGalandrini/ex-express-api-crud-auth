const AuthError = require("./AuthError");
const jsonwebtoken = require("jsonwebtoken");

/**
 *
 * @param {import("express").Request} req
 * @param {*} res
 * @param {*} next
 */
module.exports = (req, res, next) =>
{
  const bearer = req.headers.authorization;

  // controllo il bearer
  if (!bearer || !bearer.startsWith("Bearer "))
  {
    throw new AuthError("Bearer token mancante o malformato");
  }

  // estraggo il token
  const token = bearer.split(" ")[1];

  // verifico il token
  // @ts-ignore
  const user = jsonwebtoken.verify(token, process.env.JWT_SECRET);

  req["user"] = user;

  next();
};
