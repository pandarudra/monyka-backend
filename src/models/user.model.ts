import { Model, model, Schema } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  uid: string;
}
const userSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, required: true },
    uid: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> = model<IUser>("User", userSchema);
