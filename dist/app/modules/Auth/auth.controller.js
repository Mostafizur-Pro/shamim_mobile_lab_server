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
exports.authController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const connection = yield config_1.pool.getConnection();
        const [userData] = yield connection.query('SELECT * FROM user WHERE email = ?', [email]);
        const user = userData[0];
        console.log('data', user);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        connection.release();
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, 
        // "secret",
        config_1.config.jwt_secret, { expiresIn: '1y' });
        res.status(200).json({ token });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});
const getProfile = (req, res) => {
    const userId = req.user.id;
    config_1.connection.query('SELECT * FROM user WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user profile:', err);
            return res.sendStatus(500);
        }
        res.json({ user: results[0] });
    });
};
exports.authController = {
    login,
    getProfile,
};
