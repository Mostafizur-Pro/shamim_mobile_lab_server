import http from 'http'
import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import app from './app'
import { AddressInfo } from 'net'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import nodeSchedule from 'node-schedule'
import ExcelJS from 'exceljs'
import moment from 'moment-timezone'
import { config, pool } from './app/config'

dotenv.config()

// -----------------------------------------
// Email Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASSWORD,
  },
})

async function createExcelFile(): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Products')

  try {
    const [rows]: any = await pool.query('SELECT * FROM products')

    if (rows.length > 0) {
      const columnsToInclude = [
        'product_id',
        'brand',
        'user_id',
        'model',
        'ime',
        'receive_date',
        'delivery_date',
        'problem',
        'status',
        'bill',
        'customer_name',
        'customer_number',
        'paid',
        'due',
        'created_at',
      ]

      // Dynamically create columns based on the data keys
      const columns = columnsToInclude.map((key) => ({
        header: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
        key: key,
        width: 20, // Set a default width or adjust based on key length
      }))
      // const columns = Object.keys(rows[0]).map((key) => ({
      //   header: key,
      //   key: key,
      //   width: 20, // Set a default width or adjust based on key length
      // }))

      worksheet.columns = columns

      // Add rows to Excel sheet
      rows.forEach((row: any) => {
        const filteredRow = columnsToInclude.reduce((acc: any, key) => {
          acc[key] = row[key]
          return acc
        }, {})

        worksheet.addRow(filteredRow)
      })
      // rows.forEach((row: any) => {
      //   worksheet.addRow(row)
      // })

      await workbook.xlsx.writeFile('product_data.xlsx')
    }
  } catch (error) {
    console.error('Error creating Excel file:', error)
  }
}

async function sendEmail(): Promise<void> {
  await createExcelFile()

  const todayDate = moment().tz('Asia/Dhaka').format('YYYY-MM-DD')

  const mailOptions = {
    from: config.EMAIL_FROM,
    to: 'mostafizur0195@gmail.com',
    subject: `Daily Product Data - ${todayDate}`,
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

function scheduleEmail(): void {
  const currentTime = moment().tz('Asia/Dhaka')
  const targetTime = moment.tz('13:35', 'HH:mm', 'Asia/Dhaka')

  if (currentTime.isAfter(targetTime)) {
    targetTime.add(1, 'day')
  }

  console.log(
    `Scheduling email at ${targetTime.format(
      'YYYY-MM-DD HH:mm:ss'
    )} Bangladesh time`
  )

  nodeSchedule.scheduleJob(targetTime.toDate(), () => {
    console.log('Executing scheduled job...')
    sendEmail().catch(console.error)
  })
}

scheduleEmail()

// -----------------------------------------

const port = process.env.PORT || 3000

// Create an HTTP server
const server: HTTPServer = http.createServer(app)

// Create a new instance of Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: '*', // Allow all origins for development; adjust this in production
    methods: ['GET', 'POST'],
  },
})

// Initialize Socket.IO (Optional: Add Socket.IO event listeners or handlers here)

// Start the HTTP server
server.listen(port, () => {
  const address = server.address() as AddressInfo
  console.log(`Server is running on port ${address.port}`)
})
