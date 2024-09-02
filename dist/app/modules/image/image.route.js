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
router.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
// Handle requests for individual images
router.get("/uploads/:imageName", image_controller_1.ImageController.getImage);
router.get("/uploads/images/user/:imageName", image_controller_1.ImageController.getUserImage);
router.get("/uploads/images/client/:imageName", image_controller_1.ImageController.getClientImage);
router.get("/uploads/images/admin_image/:imageName", image_controller_1.ImageController.getAdminImage);
router.get("/uploads/images/Employee/:imageName", image_controller_1.ImageController.getEmployeeImage);
router.get("/uploads/images/paidImage/:imageName", image_controller_1.ImageController.getPaidImage);
router.get("/uploads/images/hallRoomPost/:imageName", image_controller_1.ImageController.getHallRoomPost);
exports.imageRoutes = router;
