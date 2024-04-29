import jwt from "jsonwebtoken";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";

export function verifyAnonToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const anonToken = process.env.ANONAUTH_SECRET;
  if (!anonToken) {
    throw new Error("ANONAUTH_SECRET is not set");
  }
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, anonToken, (err) => {
    if (err) {
      return res.sendStatus(403);
    }
    next();
  });
}
