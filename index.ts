import dotenv from 'dotenv'

dotenv.config()

const PORT:string = process.env.PORT || '8080'
import http from 'http'

import { app } from './app'
import connectDB from './config/mongo.config'

connectDB()

const server = http.createServer(app)

server.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development')
    console.log(`Server running on http://localhost:${PORT}`)
})
