import express from 'express'
import { authController } from './auth.controller'
import { authenticateUserToken } from './auth.middleware'

const router = express.Router()
router.post('/login', authController.login)
router.get('/profile', authenticateUserToken, authController.getProfile)
router.post('/change-password', authController.changePassword)
export const authRoutes = router
