"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const router = express_1.default.Router();
router.get('/admin_role', admin_controller_1.adminController.getAdminRole);
// router.get("/", authenticateJWT, adminController.getAllAdmins);
// router.get('/', adminController.getAllAdmins)
// router.get('/:id', adminController.getAdminById)
router.post('/', admin_controller_1.adminController.createAdmin);
// router.put('/:id', uploadAdmin.single('image'), adminController.updateAdmin)
// router.delete('/:id', adminController.deleteAdmin)
exports.adminRoutes = router;
