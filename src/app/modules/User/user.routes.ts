import express from 'express'
import { userController } from './user.controller'
import { multerUser } from '../../middleware/multerUser'

const router = express.Router()

router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)
router.post('/', multerUser.single('image'), userController.createUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

export const userRoutes = router
