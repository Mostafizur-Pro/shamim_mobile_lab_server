import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config, connection, pool } from '../../config'
import bcrypt from 'bcryptjs'

export interface User {
  id: number
  email: string
  name: string
  phone_number: string
}

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const connection = await pool.getConnection()

    const [userData]: any = await connection.query(
      'SELECT * FROM user WHERE email = ?',
      [email]
    )

    const user = userData[0]
    console.log('data', user)
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }

    connection.release()

    const token = jwt.sign(
      { id: user.id, email: user.email },
      // "secret",
      config.jwt_secret as string,
      { expiresIn: '1y' }
    )

    res.status(200).json({ token, user })
  } catch (error) {
    console.error('Error logging in:', error)
    res.status(500).json({ message: 'Internal Server Error.' })
  }
}

const getProfile = (req: any, res: Response) => {
  const userId = req.user.id

  connection.query(
    'SELECT * FROM user WHERE id = ?',
    [userId],
    (err, results: any) => {
      if (err) {
        console.error('Error fetching user profile:', err)

        return res.sendStatus(500)
      }
      res.json({ user: results[0] })
    }
  )
}
export const authController = {
  login,
  getProfile,
}
