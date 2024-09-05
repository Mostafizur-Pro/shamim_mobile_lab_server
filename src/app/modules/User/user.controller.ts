import { NextFunction, Request, Response } from 'express'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import moment from 'moment-timezone'
import bcrypt from 'bcryptjs'
import { connection } from '../../config'
import { sendEmail } from './user.constant'

export const userFilterableFields = ['searchTerm', 'title', 'syncId']

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { searchId, searchTerm } = req.query

    // Base query
    let query = 'SELECT * FROM user'
    const queryParams: any[] = []

    // Add conditions based on query parameters
    if (searchId) {
      query += ' WHERE id = ?'
      queryParams.push(searchId)
    } else if (searchTerm) {
      query += ' WHERE email LIKE ? OR name LIKE ? OR number LIKE ?'
      queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`)
    }

    // Execute query
    connection.query(
      query,
      queryParams,
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error('Error fetching users:', error)
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error',
            errorMessages: [
              {
                path: req.originalUrl,
                message: 'Error fetching users',
              },
            ],
          })
        }

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: 'Users fetched successfully',
          data: results,
        })
      }
    )
  }
)

const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id

    connection.query(
      'SELECT * FROM user WHERE id = ?',
      [userId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error('Error fetching user:', error)
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error',
            errorMessages: [
              {
                path: req.originalUrl,
                message: 'Error fetching user',
              },
            ],
          })
        }

        if (results.length === 0) {
          return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: 'User not found',
            errorMessages: [
              {
                path: req.originalUrl,
                message: 'User not found with given ID',
              },
            ],
          })
        }

        const user = results[0]

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: 'User fetched successfully',
          data: user,
        })
      }
    )
  }
)

// const createUser = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { name, number, role, email, password } = req.body

//     const formattedDate = moment.tz('Asia/Dhaka').format()
//     const hashedPassword = await bcrypt.hash(password, 10)

//     const newUser = {
//       name,
//       image:
//         'https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png',
//       number,
//       email,
//       password: hashedPassword,
//       role: role || 'user',
//       action: 'pending',
//       created_at: formattedDate,
//       updated_at: formattedDate,
//     }

//     connection.query(
//       'INSERT INTO user SET ?',
//       newUser,
//       (error: any, results: any, fields: any) => {
//         if (error) {
//           console.error('Error creating user:', error)
//           return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: 'Internal Server Error',
//             errorMessages: [
//               {
//                 path: req.originalUrl,
//                 message: 'Error creating user',
//               },
//             ],
//           })
//         }

//         const createdUserId = results.insertId

//           sendEmail(
//             'mostafizur0195@gmail.com',
//             'New Match Request',
//             `You have a new match request. View details at: `
//           ),

//         sendResponse(res, {
//           statusCode: httpStatus.CREATED,
//           success: true,
//           message: 'User created successfully',
//           data: { id: createdUserId },
//         })
//       }
//     )
//   }
// )

const createUser = catchAsync(async (req, res, next) => {
  const { name, number, role, email, password } = req.body

  const image = req.file?.path

  console.log('image', image)

  const formattedDate = moment.tz('Asia/Dhaka').format()
  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = {
    name,
    image:
      image ||
      'https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png',
    number,
    email,
    password: hashedPassword,
    role: role || 'user',
    action: 'pending',
    created_at: formattedDate,
    updated_at: formattedDate,
  }

  connection.query(
    'INSERT INTO user SET ?',
    newUser,
    async (error, results: any) => {
      if (error) {
        console.error('Error creating user:', error)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Internal Server Error',
          errorMessages: [
            {
              path: req.originalUrl,
              message: 'Error creating user',
            },
          ],
        })
      }

      const createdUserId = results.insertId

      // try {
      //   // Wait for email to be sent
      //   await sendEmail(
      //     'mostafizur0195@gmail.com',
      //     'New Match Request',
      //     `You have a new match request. View details at: [URL]`
      //   )
      // } catch (emailError) {
      //   console.error('Error sending email:', emailError)
      //   // Handle email sending error appropriately
      // }

      res.status(httpStatus.CREATED).json({
        success: true,
        message: 'User created successfully',
        data: { id: createdUserId },
      })
    }
  )
})

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const { name, number, email, role } = req.body

    const updatedFields: { [key: string]: any } = {}

    if (name !== undefined) {
      updatedFields.name = name
    }
    if (number !== undefined) {
      updatedFields.number = number
    }
    if (email !== undefined) {
      updatedFields.email = email
    }
    if (role !== undefined) {
      updatedFields.role = role
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'No fields to update provided',
      })
    }

    connection.query(
      'UPDATE user SET ? WHERE id = ?',
      [updatedFields, userId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error('Error updating user:', error)
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error',
            errorMessages: [
              {
                path: req.originalUrl,
                message: 'Error updating user',
              },
            ],
          })
        }

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: 'User updated successfully',
        })
      }
    )
  }
)

const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    console.log('data', userId)

    connection.query(
      'DELETE FROM user WHERE id = ?',
      [userId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error('Error deleting user:', error)
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error',
            errorMessages: [
              {
                path: req.originalUrl,
                message: 'Error deleting user',
              },
            ],
          })
        }

        if (results.affectedRows === 0) {
          return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: 'User not found',
            errorMessages: [
              {
                path: req.originalUrl,
                message: 'User not found with given profile ID',
              },
            ],
          })
        }

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: 'User deleted successfully',
        })
      }
    )
  }
)

export const userController = {
  createUser,
  getUserById,
  deleteUser,
  updateUser,
  getAllUsers,
}
