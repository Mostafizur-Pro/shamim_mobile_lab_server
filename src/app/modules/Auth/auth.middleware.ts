import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface UserPayload {
  id: string
  username: string
}

// Augment the Express Request interface to include authenticated user properties
declare global {
  namespace Express {
    interface Request {
      user: UserPayload
    }
  }
}

// Middleware function to authenticate a user token
export const authenticateUserToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization']

  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, 'secret', (err, user: any) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}
