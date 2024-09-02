"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeeByEmail = exports.checkAdminInfoByEmail = exports.checkClientDataByEmail = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = require("../app/config");
const checkClientDataByEmail = (email, req, res) => {
    config_1.connection.query("SELECT * FROM client_data WHERE email = ?", [email], (error, clientResults, fields) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            console.error("Error querying client data:", error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal Server Error",
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: "Error querying client data",
                    },
                ],
            });
        }
        if (clientResults.length > 0) {
            return res.status(http_status_1.default.BAD_REQUEST).json({
                success: false,
                message: "Email already exists in client data",
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: "Email already exists in client data",
                    },
                ],
            });
        }
    }));
};
exports.checkClientDataByEmail = checkClientDataByEmail;
const checkAdminInfoByEmail = (email, req, res) => {
    config_1.connection.query("SELECT * FROM admin_info WHERE admin_email = ?", [email], (error, adminResults, fields) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            console.error("Error querying admin info:", error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal Server Error",
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: "Error querying admin info",
                    },
                ],
            });
        }
        if (adminResults.length > 0) {
            return res.status(http_status_1.default.BAD_REQUEST).json({
                success: false,
                message: "Email already exists in admin info",
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: "Email already exists in admin info",
                    },
                ],
            });
        }
    }));
};
exports.checkAdminInfoByEmail = checkAdminInfoByEmail;
const getEmployeeByEmail = (email, req, res) => {
    config_1.connection.query("SELECT * FROM employee_info WHERE emp_email = ?", [email], (error, employeeResults, fields) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            console.error("Error querying employee info:", error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal Server Error",
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: "Error querying employee info",
                    },
                ],
            });
        }
        if (employeeResults.length > 0) {
            return res.status(http_status_1.default.BAD_REQUEST).json({
                success: false,
                message: "Email already exists in employee info",
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: "Email already exists in employee info",
                    },
                ],
            });
        }
    }));
};
exports.getEmployeeByEmail = getEmployeeByEmail;
