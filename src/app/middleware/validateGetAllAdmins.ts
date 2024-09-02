// validationMiddleware.ts
import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateGetAllAdmins = [
  check('page').optional().isInt({ min: 1 }).toInt(),
  check('limit').optional().isInt({ min: 1 }).toInt(),
  check('searchTerm').optional().isString().trim().escape(),
  check('searchId').optional().isInt().toInt(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors : any = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errorMessages: errors.array().map((err: { param: any; msg: any; }) => ({ path: err.param, message: err.msg })),
      });
    }
    next();
  }
];
