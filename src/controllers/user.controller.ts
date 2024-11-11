import { Request, Response } from "express";
import { User } from "../models/user.model";
import { v4 as genid } from "uuid";
import { hash } from "../utils/hash";

export const signup = async (req: Request, res: Response): Promise<any> => {
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
    await user.save();
    return res.status(201).json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
