"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetAllAdmins = void 0;
// validationMiddleware.ts
const express_validator_1 = require("express-validator");
exports.validateGetAllAdmins = [
    (0, express_validator_1.check)('page').optional().isInt({ min: 1 }).toInt(),
    (0, express_validator_1.check)('limit').optional().isInt({ min: 1 }).toInt(),
    (0, express_validator_1.check)('searchTerm').optional().isString().trim().escape(),
    (0, express_validator_1.check)('searchId').optional().isInt().toInt(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errorMessages: errors.array().map((err) => ({ path: err.param, message: err.msg })),
            });
        }
        next();
    }
];
