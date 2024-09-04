import multer from 'multer'
import path from 'path'
import express, { Application } from 'express'
import cors from 'cors'

const app: Application = express()
app.use(cors())
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'videos/paidVideo')
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    )
  },
})

export const uploadVideo = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video')) {
      cb(null, true)
    } else {
      cb(new Error('Only video are allowed'))
    }
  },
})
// export const uploadVideo = multer({ storage: storage });
// console.log('data', uploadVideo)

app.use('/videos', express.static(path.join(__dirname, 'videos')))
