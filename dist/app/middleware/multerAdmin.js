"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAdmin = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// Multer setup
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images/admin_image");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path_1.default.extname(file.originalname));
    },
});
exports.uploadAdmin = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        }
        else {
            cb(new Error("Only images are allowed"));
        }
    },
});
// Middleware for serving static files
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "images")));
