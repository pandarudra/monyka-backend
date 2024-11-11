import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const jwtSecret: any = process.env.JWT_SECRET;
const reftoken: any = process.env.REF_TOKEN_SECRET;

export const genToken = (user: any) => {
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in .env file");
  }

  return jwt.sign({ uid: user.uid, email: user.email }, jwtSecret, {
    expiresIn: "1h",
  });
};

export const genRefreshToken = (user: any) => {
  if (!reftoken) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined in .env file");
  }

  return jwt.sign({ uid: user.uid, email: user.email }, reftoken, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, jwtSecret);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, reftoken);
};
