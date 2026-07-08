import jwt from "jsonwebtoken";

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || "fallback_secret_key";
  return jwt.sign({ id: userId }, secret, {
    expiresIn: "7d",
  });
};

export default generateToken;
