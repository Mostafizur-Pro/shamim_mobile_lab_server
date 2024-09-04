import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import routes from './app/routes'
import httpStatus from 'http-status'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const app: Application = express()
app.use(cors())

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/', (req: Request, res: Response) => {
  res.send({
    Message: 'mobile lab server..',
  })
})

app.use('/api/v1', routes)

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  })
  next()
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || httpStatus.INTERNAL_SERVER_ERROR
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errorMessages: [
      {
        path: req.originalUrl,
        message: err.message || 'Internal Server Error',
      },
    ],
  })
})

export default app
