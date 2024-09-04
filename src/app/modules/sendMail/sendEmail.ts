import nodemailer from 'nodemailer'
import nodeSchedule from 'node-schedule'
import ExcelJS from 'exceljs'
import fs from 'fs'
import moment from 'moment-timezone'
import { config } from '../../config'

// Utility function to generate a random password
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

// Configure your email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use the correct email service
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASSWORD,
  },
})

// Function to create an Excel file
async function createExcelFile(): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Products')

  // Define columns
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Price', key: 'price', width: 15 },
  ]

  // Add rows (replace with your data fetching logic)
  worksheet.addRow({ id: 1, name: 'Product 1', price: 10.99 })
  worksheet.addRow({ id: 2, name: 'Product 2', price: 15.99 })

  // Save to file
  await workbook.xlsx.writeFile('product_data.xlsx')
}

// Function to send an email
async function sendEmail(): Promise<void> {
  await createExcelFile()

  const mailOptions = {
    from: config.EMAIL_FROM,
    to: 'mostafizur0195@gmail.com',
    subject: 'Daily Product Data',
    text: 'Please find the attached product data file.',
    attachments: [
      {
        filename: 'product_data.xlsx',
        path: './product_data.xlsx',
      },
    ],
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Email sent successfully!')
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

// Function to get the current time in BST and schedule the job accordingly
function scheduleEmail(): void {
  const currentTime = moment().tz('Asia/Dhaka')
  const targetTime = moment.tz('15:09', 'HH:mm', 'Asia/Dhaka')

  // If current time is past the target time, schedule for the next day
  if (currentTime.isAfter(targetTime)) {
    targetTime.add(1, 'day')
  }

  // Log the scheduled time for debugging purposes
  console.log(
    `Scheduling email at ${targetTime.format(
      'YYYY-MM-DD HH:mm:ss'
    )} Bangladesh time`
  )

  // Schedule the job
  nodeSchedule.scheduleJob(targetTime.toDate(), () => {
    console.log('Executing scheduled job...')
    sendEmail().catch(console.error) // Ensure any errors are caught and logged
  })
}

// Call scheduleEmail function to set up the job
scheduleEmail()
