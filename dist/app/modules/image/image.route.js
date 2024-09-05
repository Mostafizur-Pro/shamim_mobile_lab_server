"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const image_controller_1 = require("./image.controller");
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
// router.get("/uploads/:imageName", ImageController.getImage);
router.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
// Handle requests for individual images
router.get('/uploads/:imageName', image_controller_1.ImageController.getImage);
router.get('/uploads/images/user/:imageName', image_controller_1.ImageController.getUserImage);
router.get('/uploads/images/product/:imageName', image_controller_1.ImageController.getProductImage);
exports.imageRoutes = router;
