import express from 'express'
import { ImageController } from './image.controller'
import path from 'path'

const router = express.Router()

// router.get("/uploads/:imageName", ImageController.getImage);

router.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Handle requests for individual images
router.get('/uploads/:imageName', ImageController.getImage)
router.get('/uploads/images/user/:imageName', ImageController.getUserImage)

export const imageRoutes = router
