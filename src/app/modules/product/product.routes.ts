import express from 'express'
import { productController } from './product.controller'
import { multerProduct } from '../../middleware/multerProduct'

const router = express.Router()

router.get('/', productController.getAllProducts)
router.get('/:id', productController.getProductById)
// router.post('/', uploadProduct.single('image'), productController.createProduct)
router.post('/', multerProduct.single('image'), productController.createProduct)
router.put('/:id', productController.updateProduct)

router.delete('/:id', productController.deleteProduct)

export const productRoutes = router
