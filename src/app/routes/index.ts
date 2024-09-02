import express from 'express'
import { authRoutes } from '../modules/Auth/auth.routes'
import { adminRoutes } from '../modules/Admin/admin.routes'
import { userRoutes } from '../modules/User/user.routes'
import { productRoutes } from '../modules/product/product.routes'

const router = express.Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },

  {
    path: '/admin',
    route: adminRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/products',
    route: productRoutes,
  },
  // {
  //   path: "/user",
  //   route: userRoutes,
  // },
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))
export default router
