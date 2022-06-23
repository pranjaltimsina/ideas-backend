import express, { Router } from 'express'

import jwt from '../middlewares/jwt'

import * as ideaController from '../controllers/ideaController'
import * as commentController from '../controllers/commentController'

const router: Router = express.Router()

router.use(jwt)

router.get('/', ideaController.getAllIdeas)

router.post('/', ideaController.createIdea)

router.put('/:ideaId', ideaController.editIdea)

router.delete('/:ideaId', ideaController.deleteIdea)

router.patch('/:ideaId/vote', ideaController.voteIdea)

router.post('/:ideaId/comments', commentController.addComment)

router.delete('/:ideaId/comments', commentController.deleteComment)

router.put('/:ideaId/comments', commentController.editComment)

export default router
