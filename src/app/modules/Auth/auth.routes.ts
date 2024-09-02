import express from 'express'
import { authController } from './auth.controller'
import { authenticateUserToken } from './auth.middleware'

const router = express.Router()
router.post('/login', authController.login)
router.get('/profile', authenticateUserToken, authController.getProfile)
export const authRoutes = router

/*
i will send welcome message in masking SMS used API
provide backend and frontend code

*/
