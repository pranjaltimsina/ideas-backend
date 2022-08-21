import express, { Router } from 'express'

import jwt from '../middlewares/jwt'
import verifyPathParams from '../middlewares/verifyPathParams'

import * as userController from '../controllers/userController'

const router: Router = express.Router()

router.get('/', userController.getAllUsers)

router.get('/:userId/comments', jwt, verifyPathParams(['userId']), userController.getUserComments)

router.get('/:userId/ideas', jwt, verifyPathParams(['userId']), userController.getUserIdeas)

router.get('/:userId', jwt, verifyPathParams(['userId']), userController.getUserProfile)

router.get('/:userId/ideas/unapproved', jwt, verifyPathParams(['userId']), userController.getUnapprovedIdeas)

export default router
