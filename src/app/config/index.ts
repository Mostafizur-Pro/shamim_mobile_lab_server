import mysql from 'mysql2'
import mysql1 from 'mysql2/promise'

export const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mobile_lab',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export const pool = mysql1.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mobile_lab',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export const config = {
  node_env: 'production',
  port: 5000,
  bycrypt_salt_round: 12,
  jwt_secret: 'secret',
  jwt_expires_in: '3d',
  jwt_refresh_token: 'very very secret',
  jwt_refresh_expires_in: '750d',
  EMAIL_PORT: 587,
  EMAIL_USER: 'mostafizur0195@gmail.com',
  EMAIL_PASSWORD: 'fvuv gexs gnym zxrx',
  EMAIL_FROM: 'mostafizur0195@gmail.com',
}

// https://g.co/kgs/Wk7kFBG
// DB: mobile_lab
// UN: mobile_lab_admin
// PASS: Ln%kH7O?Mj6Y
