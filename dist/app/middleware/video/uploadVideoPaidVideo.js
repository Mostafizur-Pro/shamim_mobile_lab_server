"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideo = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'videos/paidVideo');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
    },
});
exports.uploadVideo = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only video are allowed'));
        }
    },
});
// export const uploadVideo = multer({ storage: storage });
// console.log('data', uploadVideo)
app.use('/videos', express_1.default.static(path_1.default.join(__dirname, 'videos')));
