"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.pool = exports.connection = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const promise_1 = __importDefault(require("mysql2/promise"));
exports.connection = mysql2_1.default.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mobile_lab',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
exports.pool = promise_1.default.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mobile_lab',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
exports.config = {
    node_env: 'production',
    port: 5000,
    bycrypt_salt_round: 12,
    jwt_secret: 'secret',
    jwt_expires_in: '3d',
    jwt_refresh_token: 'very very secret',
    jwt_refresh_expires_in: '750d',
    EMAIL_PORT: 587,
    EMAIL_USER: 'mostafizur0195@gmail.com',
    EMAIL_PASSWORD: 'tfme ryse zmvl tat',
    EMAIL_FROM: 'mostafizur0195@gmail.com',
};
// https://g.co/kgs/Wk7kFBG
