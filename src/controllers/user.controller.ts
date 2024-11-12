import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import { v4 as genid } from "uuid";
import { compare, hash } from "../utils/hash";
import { genRefreshToken, genToken, verifyRefreshToken } from "../utils/auth";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { email, password, firstName, lastName, role } = req.body;
  try {
    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
      res.status(400).json({ message: "User with email already exists" });
    }
    const user = new User({
      email,
      password: await hash(password),
      firstName,
      lastName,
      role,
      uid: genid(),
    });
    user.reftoken = genRefreshToken(user);
    await user.save();
    const token = genToken(user);
    return res.status(201).json({ token, reftoken: user.reftoken });
  } catch (error: any) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!compare(password, user.password)) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = genToken(user);
    const reftoken = genRefreshToken(user);
    user.reftoken = reftoken;
    await user.save();
    return res.status(200).json({ token, user });
  } catch (error: any) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { reftoken } = req.body;
  try {
    const decoded: any = verifyRefreshToken(reftoken);
    const user = await User.findOne({ uid: decoded.uid, email: decoded.email });
    if (!user || user.reftoken !== reftoken) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }
    const newToken = genToken(user);
    return res.status(200).json({ token: newToken, user });
  } catch (error: any) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { reftoken } = req.body;
  try {
    const decoded: any = verifyRefreshToken(reftoken);
    const user = await User.findOne({ uid: decoded.uid, email: decoded.email });
    if (!user || user.reftoken !== reftoken) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }
    user.reftoken = "";
    await user.save();
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    next(error);
  }
};
