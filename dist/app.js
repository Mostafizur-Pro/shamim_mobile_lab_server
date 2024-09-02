"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const http_status_1 = __importDefault(require("http-status"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
//parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
    res.send({
        Message: 'demo_project server..',
    });
});
app.use('/api/v1', routes_1.default);
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'Not Found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: 'API Not Found',
            },
        ],
    });
    next();
});
app.use((err, req, res, next) => {
    const statusCode = err.status || http_status_1.default.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        errorMessages: [
            {
                path: req.originalUrl,
                message: err.message || 'Internal Server Error',
            },
        ],
    });
});
exports.default = app;
