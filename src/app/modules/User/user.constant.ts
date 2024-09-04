import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'
import { config } from '../../config'

export type IUserFilter = {
  searchTerm: string
  email?: string
}

export const generateRandomPassword = (): string => {
  const length = 8
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let password = ''
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n))
  }
  return password
}

export const sendEmail = async (to: string, subject: string, html: any) => {
  const transporter = nodemailer.createTransport(
    smtpTransport({
      service: 'Gmail',
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASSWORD,
      },
    })
  )
  const mailOptions = {
    from: config.EMAIL_FROM,
    to,
    subject,
    html,
  }

  await transporter.sendMail(mailOptions)
}
