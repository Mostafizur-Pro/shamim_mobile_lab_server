"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
// import { initializeSocketIO } from "./chat.controller";
dotenv_1.default.config();
const port = process.env.PORT || 3000;
// Create an HTTP server
const server = http_1.default.createServer(app_1.default);
// Create a new instance of Socket.IO
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*', // Allow all origins for development; adjust this in production
        methods: ['GET', 'POST'],
    },
});
// Initialize Socket.IO
// Start the HTTP server
server.listen(port, () => {
    const address = server.address();
    console.log(`Server is running on port ${address.port}`);
});
