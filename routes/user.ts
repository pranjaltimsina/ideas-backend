import express, { Router } from 'express'

import jwt from '../middlewares/jwt'

import * as userController from '../controllers/userController'

const router: Router = express.Router()

router.use(jwt)

router.get('/:userId/comments', userController.getUserComments)

router.get('/:userId/ideas', userController.getUserIdeas)

router.get('/:userId', userController.getUserProfile)

export default router
