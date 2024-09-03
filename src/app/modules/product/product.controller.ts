import { NextFunction, Request, Response } from 'express'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import moment from 'moment-timezone'
import { connection } from '../../config'

interface ApiResponse {
  statusCode: number
  success: boolean
  message: string
  data: any[]
  totalCount: number
  grandTotal: number
}

const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string, 10) || 1
    const limit = parseInt(req.query.limit as string, 10) || 10
    const searchTerm = req.query.searchTerm as string
    const searchId = parseInt(req.query.searchId as string, 10)

    const startIndex = (page - 1) * limit

    let query = `SELECT * FROM products`
    const queryParams: (string | number)[] = []
    let whereClause = ''

    if (searchTerm) {
      whereClause += ` id LIKE ? OR title LIKE ? OR post LIKE ?`
      queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`)
    }

    if (searchId) {
      if (whereClause) {
        whereClause += ' AND'
      }
      whereClause += ' id = ?'
      queryParams.push(searchId)
    }

    if (whereClause) {
      query += ` WHERE ${whereClause}`
    }

    let grandTotalQuery = `SELECT COUNT(*) AS count FROM products`
    if (whereClause) {
      grandTotalQuery += ` WHERE ${whereClause}`
    }

    connection.query(
      grandTotalQuery,
      queryParams,
      (error: any, grandTotalResult: any) => {
        if (error) {
          console.error('Error fetching grand total:', error)
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error',
            errorMessages: [
              { path: req.originalUrl, message: 'Error fetching grand total' },
            ],
          })
        }

        const grandTotal =
          grandTotalResult && grandTotalResult.length > 0
            ? grandTotalResult[0].count
            : 0

        query += ` ORDER BY id DESC LIMIT ?, ?`
        queryParams.push(startIndex, limit)

        connection.query(query, queryParams, (error: any, results: any) => {
          if (error) {
            console.error('Error fetching question:', error)
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
              success: false,
              message: 'Internal Server Error',
              errorMessages: [
                {
                  path: req.originalUrl,
                  message: 'Error fetching question',
                },
              ],
            })
          }

          const totalCount = results.length

          const response: ApiResponse = {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Question fetched successfully',
            totalCount: totalCount,
            grandTotal: grandTotal,
            data: results,
          }

          return res.status(response.statusCode).json(response)
        })
      }
    )
  }
)

const getProductById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id

    connection.query(
      'SELECT * FROM products WHERE product_id = ?',
      [postId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error('Error fetching post:', error)
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error',
            errorMessages: [
              {
                path: req.originalUrl,
                message: 'Error fetching post',
              },
            ],
          })
        }

        if (results.length === 0) {
          return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: 'Post not found',
            errorMessages: [
              {
                path: req.originalUrl,
                message: 'Post not found with given ID',
              },
            ],
          })
        }

        const post = results[0]

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: 'Post fetched successfully',
          data: post,
        })
      }
    )
  }
)

const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log('brand', req.body.brand)

    const formattedDate = moment.tz('Asia/Dhaka').format()
    const userId = req.body.user_id

    const currentYear = moment().format('YY')
    const currentMonth = moment().format('MM')
    const prefix = `P${currentYear}${currentMonth}${userId}`

    connection.query(
      'SELECT product_id FROM products WHERE product_id LIKE ? ORDER BY product_id DESC LIMIT 1',
      [`${prefix}%`],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error('Error fetching latest product_id:', error)
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error',
            errorMessages: [
              {
                path: req.originalUrl,
                message: 'Error fetching latest product_id',
              },
            ],
          })
        }

        const lastProductId = results[0]?.product_id || `${prefix}0000`
        const lastSequenceNumber = parseInt(lastProductId.slice(-4), 10)
        const newSequenceNumber = lastSequenceNumber + 1
        const newProductId = `${prefix}${newSequenceNumber
          .toString()
          .padStart(3, '0')}`

        const newPost = {
          brand: req.body.brand,
          user_id: userId,
          product_id: newProductId,
          model: req.body.model || null,
          ime: req.body.ime || null,
          image: req.body.image || null,
          receive_date: req.body.receive_date,
          delivery_date: req.body.delivery_date,
          problem: req.body.problem,
          status: req.body.status,
          bill: req.body.bill,
          customer_name: req.body.customer_name,
          customer_number: req.body.customer_number,
          paid: req.body.paid,
          due: req.body.due,
          created_at: formattedDate,
          updated_at: formattedDate,
        }

        connection.query(
          'INSERT INTO products SET ?',
          newPost,
          (error: any, results: any, fields: any) => {
            if (error) {
              console.error('Error creating newPost:', error)
              return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal Server Error',
                errorMessages: [
                  {
                    path: req.originalUrl,
                    message: 'Error creating newPost',
                  },
                ],
              })
            }

            const createdPostId = results.insertId
            const printData = {
              product_id: newProductId,
              customer_name: req.body.customer_name,
              customer_number: req.body.customer_number,
            }

            sendResponse(res, {
              statusCode: httpStatus.CREATED,
              success: true,
              message: 'Post created successfully',
              data: { id: createdPostId, printData },
            })
          }
        )
      }
    )
  }
)

const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const {
      brand,
      model,
      delivery_date,
      problem,
      status,
      product_id,
      ime,
      image,
      receive_date,
      bill,
      customer_name,
      customer_number,
      paid,
      due,
    } = req.body

    const updatedFields: { [key: string]: any } = {}

    // Add all fields to the update object if they are provided in the request
    if (brand !== undefined) updatedFields.brand = brand
    if (model !== undefined) updatedFields.model = model
    if (delivery_date !== undefined) updatedFields.delivery_date = delivery_date
    if (problem !== undefined) updatedFields.problem = problem
    if (status !== undefined) updatedFields.status = status
    if (product_id !== undefined) updatedFields.product_id = product_id
    if (ime !== undefined) updatedFields.ime = ime
    if (image !== undefined) updatedFields.image = image
    if (receive_date !== undefined) updatedFields.receive_date = receive_date
    if (bill !== undefined) updatedFields.bill = bill
    if (customer_name !== undefined) updatedFields.customer_name = customer_name
    if (customer_number !== undefined)
      updatedFields.customer_number = customer_number
    if (paid !== undefined) updatedFields.paid = paid
    if (due !== undefined) updatedFields.due = due

    // Check if there's anything to update
    if (Object.keys(updatedFields).length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'No fields to update provided',
      })
    }

    // Perform the update query
    connection.query(
      'UPDATE products SET ? WHERE id = ?',
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

const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id

    connection.query(
      'DELETE FROM products WHERE id = ?',
      [postId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error('Error deleting post:', error)
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error',
            errorMessages: [
              {
                path: req.originalUrl,
                message: 'Error deleting post',
              },
            ],
          })
        }

        if (results.affectedRows === 0) {
          return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: 'Post not found',
            errorMessages: [
              {
                path: req.originalUrl,
                message: 'Post not found with given profile ID',
              },
            ],
          })
        }

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: 'Post deleted successfully',
        })
      }
    )
  }
)

export const productController = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}
