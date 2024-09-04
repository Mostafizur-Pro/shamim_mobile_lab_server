import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config, connection, pool } from '../../config'
import bcrypt from 'bcryptjs'

export interface User {
  id: number
  email: string
  name: string
  phone_number: string
  password: string
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

const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword, id } = req.body

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing required fields.' })
  }

  try {
    const connection = await pool.getConnection()

    const [userData]: any = await connection.query(
      'SELECT * FROM user WHERE id = ?',
      [id]
    )

    if (!userData) {
      connection.release()
      return res
        .status(404)
        .json({ success: false, message: 'Employee not found.' })
    }

    const isMatch = await bcrypt.compare(currentPassword, userData[0].password)

    if (!isMatch) {
      connection.release()
      return res
        .status(401)
        .json({ success: false, message: 'Current password is incorrect.' })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    await connection.query('UPDATE user SET password = ? WHERE id = ?', [
      hashedNewPassword,
      id,
    ])

    connection.release()

    res
      .status(200)
      .json({ success: true, message: 'Password updated successfully.' })
  } catch (error) {
    console.error('Error changing password:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error.' })
  }
}

export const authController = {
  login,
  getProfile,
  changePassword,
}
