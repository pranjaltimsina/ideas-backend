import express, { Request, Response, Express} from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import router from './routes/index'

const app: Express = express()

app.use(helmet())
app.disable('x-powered-by')

// app.use(cors({
//   origin: 'http://127.0.0.1:3000',
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true
// }))

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({
  extended: true
}))

app.use(compression())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use('/', router)

export { app }
