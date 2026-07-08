import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/users";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {

      token = req.headers.authorization.split(" ")[1];

    
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret_key"
      ) as { id: string };

      const user = await User.findById(decoded.id).select("-password");
      
      if (!user) {
        res.status(401).json({ success: false, message: "Not authorized, user not found" });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).json({ success: false, message: "Not authorized, token failed" });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: "Not authorized, no token provided" });
    return;
  }
};
