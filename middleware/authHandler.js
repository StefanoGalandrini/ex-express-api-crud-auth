const AuthError = require("../errors/AuthError");
const jsonwebtoken = require("jsonwebtoken");

/**
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

  const user = jsonwebtoken.verify(token, process.env.JWT_SECRET ?? "Stefano");

  req["user"] = user;

  next();
};
