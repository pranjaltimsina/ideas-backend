import dotenv from 'dotenv'
import http from 'http'
import { exit } from 'process'

import { app } from './app'
import connectDB from './config/mongo.config'
// import addPostCount from './scripts/addPostcount'

dotenv.config({ path: './.env' })

const PORT: string = process.env.PORT || '8080'

const MONGO_URI: string = process.env.MONGO_URI || ''

if (MONGO_URI === '') {
  if (process.env.NODE_ENV === 'development') {
    console.error('Could not find MONGO URI in environment variables.')
    exit()
  }
}

connectDB(MONGO_URI)

// addPostCount()

const server = http.createServer(app)

server.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') { console.log(`Server running on http://localhost:${PORT}`) }
})
