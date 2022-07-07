import express, { Router } from 'express'

import jwt from '../middlewares/jwt'
import verifyParams from '../middlewares/verifyParams'

import * as userController from '../controllers/userController'

const router: Router = express.Router()

router.use(jwt)

router.get('/:userId/comments', verifyParams(['userId']), userController.getUserComments)

router.get('/:userId/ideas', verifyParams(['userId']), userController.getUserIdeas)

router.get('/:userId', verifyParams(['userId']), userController.getUserProfile)

export default router
