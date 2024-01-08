import { Token } from "../../DB/models/token.model.js";
import { asyncHandler } from "../../utilies/asyncHandler.js";
import Jwt from "jsonwebtoken";



export const authentication = asyncHandler(async (req, res, next) => {
  let { token } = req.headers;
  if (!token) {
    return next(new Error("token missing", { cause: 400 }))
  }
  if (!token.startsWith("Route__")) return next(new Error("invalid token", { cause: 401 }))
  token = token.split("Route__")[1];
  const tokenDb = await Token.findOne({ token, isValid: true })
  if (!tokenDb) return next(new Error(" token is expired ", { cause: 401 }))
  const payload = Jwt.verify(token, "secretKey");
  req.payload = payload;
  next()
}) 