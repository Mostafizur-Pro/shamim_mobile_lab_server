import { NextFunction, Request, Response } from 'express'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import bcrypt from 'bcryptjs'
import moment from 'moment-timezone'
import { connection } from '../../config'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

interface ApiResponse {
  statusCode: number
  success: boolean
  message: string
  data: any[]
  totalCount: number
  grandTotal: number
}

// const getAllAdmins = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const page = parseInt(req.query.page as string) || 1
//     const limit = parseInt(req.query.limit as string) || 20
//     const searchTerm = req.query.searchTerm as string
//     const searchId = parseInt(req.query.searchId as string)
//     const startIndex = (page - 1) * limit
//     let query = `SELECT * FROM admin_info`

//     const queryParams: (string | number)[] = []
//     let whereClause = ''

//     if (searchTerm) {
//       whereClause += ` (id LIKE ? OR number LIKE ? OR profile_id LIKE ? OR admin_email LIKE ? OR role LIKE ?) `
//       queryParams.push(
//         `%${searchTerm}%`,
//         `%${searchTerm}%`,
//         `%${searchTerm}%`,
//         `%${searchTerm}%`,
//         `%${searchTerm}%`
//       )
//     }

//     if (searchId) {
//       if (whereClause) {
//         whereClause += ' AND '
//       }
//       whereClause += ' id = ?'
//       queryParams.push(searchId)
//     }

//     if (whereClause) {
//       query += ` WHERE ${whereClause}`
//     }

//     let grandTotalQuery = `SELECT COUNT(*) AS count FROM admin_info`

//     if (whereClause) {
//       grandTotalQuery += ` WHERE ${whereClause}`
//     }

//     connection.query(
//       grandTotalQuery,
//       queryParams,
//       (error: any, grandTotalResult: any, fields: any) => {
//         if (error) {
//           console.error('Error fetching grand total:', error)
//           return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: 'Internal Server Error',
//             errorMessages: [
//               {
//                 path: req.originalUrl,
//                 message: 'Error fetching grand total',
//               },
//             ],
//           })
//         }

//         const grandTotal = grandTotalResult[0].count

//         query += ` ORDER BY id DESC LIMIT ?, ?`
//         queryParams.push(startIndex, limit)

//         connection.query(
//           query,
//           queryParams,
//           (error: any, results: any, fields: any) => {
//             if (error) {
//               console.error('Error fetching admins:', error)
//               return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//                 success: false,
//                 message: 'Internal Server Error',
//                 errorMessages: [
//                   {
//                     path: req.originalUrl,
//                     message: 'Error fetching admins',
//                   },
//                 ],
//               })
//             }

//             const totalCount = results.length

//             const response: ApiResponse = {
//               statusCode: httpStatus.CREATED,
//               success: true,
//               message: 'Admins fetched successfully',
//               totalCount: totalCount,
//               grandTotal: grandTotal,
//               data: results,
//             }

//             return res.status(response.statusCode).json(response)
//           }
//         )
//       }
//     )
//   }
// )

// const getAdminById = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const adminId = req.params.id

//     connection.query(
//       'SELECT * FROM admin_info WHERE profile_id = ?',
//       [adminId],
//       (error: any, results: any, fields: any) => {
//         if (error) {
//           console.error('Error fetching admin:', error)
//           return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: 'Internal Server Error',
//             errorMessages: [
//               {
//                 path: req.originalUrl,
//                 message: 'Error fetching admin',
//               },
//             ],
//           })
//         }

//         if (results.length === 0) {
//           return res.status(httpStatus.NOT_FOUND).json({
//             success: false,
//             message: 'Admin not found',
//             errorMessages: [
//               {
//                 path: req.originalUrl,
//                 message: 'Admin not found with given ID',
//               },
//             ],
//           })
//         }

//         const admin = results[0]

//         sendResponse(res, {
//           statusCode: httpStatus.OK,
//           success: true,
//           message: 'Admin fetched successfully',
//           data: admin,
//         })
//       }
//     )
//   }
// )

const getAdminRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    connection.query(
      'SELECT * FROM admin_role WHERE ',

      (error: any, results: any, fields: any) => {
        if (error) {
          console.error('Error fetching admin:', error)
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error',
            errorMessages: [
              {
                path: req.originalUrl,
                message: 'Error fetching admin',
              },
            ],
          })
        }

        if (results.length === 0) {
          return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: 'Admin role not found',
            errorMessages: [
              {
                path: req.originalUrl,
                message: 'Admin role not found with given ID',
              },
            ],
          })
        }

        const admin = results[0]

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: 'Admin role fetched successfully',
          data: admin,
        })
      }
    )
  }
)
const createAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const adminData = req.body
    const { name, number, image, role, email, password } = req.body
    // console.log('admin', adminData)

    const formattedDate = moment.tz('Asia/Dhaka').format()
    const hashedPassword = await bcrypt.hash(password, 10)

    const newAdmin = {
      name,
      profile_id: '01',
      number,
      image,
      role,
      email,
      password: hashedPassword,
      action: 'pending',
      created_at: formattedDate,
      updated_at: formattedDate,
    }

    connection.query(
      'INSERT INTO admin SET ?',
      newAdmin,
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error('Error creating admin:', error)
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error',
            errorMessages: [
              {
                path: req.originalUrl,
                message: 'Error creating admin',
              },
            ],
          })
        }

        const createdAdminId = results.insertId

        sendResponse(res, {
          statusCode: httpStatus.CREATED,
          success: true,
          message: 'Admin created successfully',
          data: { id: createdAdminId },
        })
      }
    )
  }
)

// const updateAdmin = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const adminId = req.params.id
//     const { name, number, admin_email, password, role } = req.body
//     const image = req.file?.path
//     const updatedFields: { [key: string]: any } = {}

//     if (name !== undefined) {
//       updatedFields.name = name
//     }
//     if (number !== undefined) {
//       updatedFields.number = number
//     }
//     if (admin_email !== undefined) {
//       updatedFields.admin_email = admin_email
//     }
//     if (password !== undefined) {
//       updatedFields.password = password
//     }
//     if (role !== undefined) {
//       updatedFields.role = role
//     }
//     try {
//       const existingAdmin: any = await findAdminByNumberOrEmail(
//         number,
//         admin_email,
//         adminId
//       )

//       if (existingAdmin) {
//         const duplicateFields = []

//         if (existingAdmin.number === number) {
//           duplicateFields.push('number')
//         }
//         if (existingAdmin.admin_email === admin_email) {
//           duplicateFields.push('admin_email')
//         }
//         // console.log('error', duplicateFields)

//         return res.status(httpStatus.BAD_REQUEST).json({
//           success: false,
//           message: `Duplicate ${duplicateFields.join(
//             ' and '
//           )} provided. Please use unique values.`,
//         })
//       }

//       if (image) {
//         const resizedImagePath = image.replace(
//           path.extname(image),
//           'r' + path.extname(image)
//         )

//         await sharp(image)
//           .resize({ width: 800 })
//           .jpeg({ quality: 80 })
//           .toFile(resizedImagePath)

//         updatedFields.image = resizedImagePath

//         const imagePath = path.resolve(__dirname, '..', '..', '..', '..', image)

//         try {
//           if (fs.existsSync(imagePath)) {
//             fs.unlinkSync(imagePath)
//             // console.log(`Deleted image file: ${imagePath}`);
//           } else {
//             // console.log(`Image file not found: ${imagePath}`);
//           }
//         } catch (error) {
//           console.error(`Error deleting image file: ${imagePath}`, error)
//         }
//       }

//       if (Object.keys(updatedFields).length === 0) {
//         return res.status(httpStatus.BAD_REQUEST).json({
//           success: false,
//           message: 'No fields to update provided',
//         })
//       }

//       connection.query(
//         'UPDATE admin_info SET ? WHERE profile_id = ?',
//         [updatedFields, adminId],
//         (error: any, results: any, fields: any) => {
//           if (error) {
//             console.error('Error updating admin:', error)
//             return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//               success: false,
//               message: 'Internal Server Error',
//               errorMessages: [
//                 {
//                   path: req.originalUrl,
//                   message: 'Error updating admin',
//                 },
//               ],
//             })
//           }

//           sendResponse(res, {
//             statusCode: httpStatus.OK,
//             success: true,
//             message: 'Admin updated successfully',
//           })
//         }
//       )
//     } catch (error) {
//       console.error('Error updating employee:', error)
//       return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: 'Internal Server Error',
//         errorMessages: [
//           {
//             path: req.originalUrl,
//             message: 'Error updating employee',
//           },
//         ],
//       })
//     }
//   }
// )

// const findAdminByNumberOrEmail = async (
//   number: string,
//   admin_email: string,
//   adminId: string
// ) => {
//   const query =
//     'SELECT * FROM admin_info WHERE (number = ? OR admin_email = ?) AND profile_id <> ?'
//   return new Promise((resolve, reject) => {
//     connection.query(
//       query,
//       [number, admin_email, adminId],
//       (error: any, results: any) => {
//         if (error) {
//           reject(error)
//         } else {
//           resolve(results[0])
//         }
//       }
//     )
//   })
// }

// const deleteAdmin = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const adminId = req.params.id

//     connection.query(
//       'DELETE FROM admin_info WHERE profile_id = ?',
//       [adminId],
//       (error: any, results: any, fields: any) => {
//         if (error) {
//           console.error('Error deleting admin:', error)
//           return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: 'Internal Server Error',
//             errorMessages: [
//               {
//                 path: req.originalUrl,
//                 message: 'Error deleting admin',
//               },
//             ],
//           })
//         }

//         if (results.affectedRows === 0) {
//           return res.status(httpStatus.NOT_FOUND).json({
//             success: false,
//             message: 'Admin not found',
//             errorMessages: [
//               {
//                 path: req.originalUrl,
//                 message: 'Admin not found with given profile ID',
//               },
//             ],
//           })
//         }

//         sendResponse(res, {
//           statusCode: httpStatus.OK,
//           success: true,
//           message: 'Admin deleted successfully',
//         })
//       }
//     )
//   }
// )

export const adminController = {
  createAdmin,
  getAdminRole,
  // getAdminById,
  // deleteAdmin,
  // updateAdmin,
  // getAllAdmins,
}
