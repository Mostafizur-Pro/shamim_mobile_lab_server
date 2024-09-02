// Define the user payload interface
interface UserPayload {
  adminId: number;
  email: string;
}

// Extend the Express Request interface to include the user payload
declare module 'express-serve-static-core' {
  interface Request {
    user?: UserPayload;
  }
}

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  // console.log("data", req.headers);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token missing or invalid",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.user = user as UserPayload;  // Type assertion
    next();
  });
};
