import express, { Request, Response, Router } from 'express'

import auth from './auth'
import ideas from './ideas'
import user from './user'
import admin from './admin'
import verifyJWT from '../middlewares/jwt'
import { getNotifications } from '../controllers/userController'

const router: Router = express.Router()

router.get('/', (req: Request, res: Response) => {
  res.status(200)
    .json({
      status: 'Server is up'
    })
})

router.use('/auth', auth)
router.use('/ideas', ideas)
router.use('/user', user)
router.use('/admin', admin)
router.use('/notifications', verifyJWT, getNotifications)

export default router
