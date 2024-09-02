"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("./auth.middleware");
const router = express_1.default.Router();
router.post('/login', auth_controller_1.authController.login);
router.get('/profile', auth_middleware_1.authenticateUserToken, auth_controller_1.authController.getProfile);
exports.authRoutes = router;
/*
i will send welcome message in masking SMS used API
provide backend and frontend code

*/
