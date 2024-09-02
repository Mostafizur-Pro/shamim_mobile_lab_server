import express from 'express'
import { adminController } from './admin.controller'
import { uploadAdmin } from '../../middleware/multerAdmin'

const router = express.Router()

router.get('/admin_role', adminController.getAdminRole)
// router.get("/", authenticateJWT, adminController.getAllAdmins);
// router.get('/', adminController.getAllAdmins)
// router.get('/:id', adminController.getAdminById)
router.post('/', adminController.createAdmin)
// router.put('/:id', uploadAdmin.single('image'), adminController.updateAdmin)
// router.delete('/:id', adminController.deleteAdmin)

export const adminRoutes = router
