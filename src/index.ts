import http from 'http'
import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import app from './app'
import dotenv from 'dotenv'
import { AddressInfo } from 'net'

// import { initializeSocketIO } from "./chat.controller";

dotenv.config()

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

// Initialize Socket.IO

// Start the HTTP server
server.listen(port, () => {
  const address = server.address() as AddressInfo
  console.log(`Server is running on port ${address.port}`)
})
