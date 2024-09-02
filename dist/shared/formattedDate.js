"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formattedDate = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
// export const formattedDate = moment.tz("Asia/Dhaka").format();
exports.formattedDate = moment_timezone_1.default.tz("Asia/Dhaka").format('YYYY-MM-DD HH:mm:ss');
