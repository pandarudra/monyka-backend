import bcryptjs from "bcryptjs";

export const hash = async (password: string): Promise<string> => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};
export const compare = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcryptjs.compare(password, hash);
};
