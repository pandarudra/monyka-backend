import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/auth";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader: any = req.headers["Authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded: any = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
