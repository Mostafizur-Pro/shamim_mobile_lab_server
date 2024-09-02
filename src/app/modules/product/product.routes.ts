import express from 'express'
import { productController } from './product.controller'

const router = express.Router()

router.get('/', productController.getAllProducts)
router.get('/:id', productController.getProductById)
// router.post('/', uploadProduct.single('image'), productController.createProduct)
router.post('/', productController.createProduct)
router.put('/:id', productController.updateProduct)

router.delete('/:id', productController.deleteProduct)

export const productRoutes = router
