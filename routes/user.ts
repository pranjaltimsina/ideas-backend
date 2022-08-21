import express, { Router } from 'express'

import jwt from '../middlewares/jwt'
import verifyPathParams from '../middlewares/verifyPathParams'

import * as userController from '../controllers/userController'

const router: Router = express.Router()

router.use(jwt)

router.get('/', userController.getAllUsers)

router.get('/:userId/comments', verifyPathParams(['userId']), userController.getUserComments)

router.get('/:userId/ideas', verifyPathParams(['userId']), userController.getUserIdeas)

router.get('/:userId', verifyPathParams(['userId']), userController.getUserProfile)

router.get('/:userId/ideas/unapproved', verifyPathParams(['userId']), userController.getUnapprovedIdeas)

export default router
