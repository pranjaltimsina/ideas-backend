import express, { Router } from 'express'

import jwt from '../middlewares/jwt'

import * as ideaController from '../controllers/ideaController'
import * as commentController from '../controllers/commentController'
import verifyPathParams from '../middlewares/verifyPathParams'

const router: Router = express.Router()

router.use(jwt)

router.get('/', ideaController.getAllIdeas)

router.post('/', ideaController.createIdea)

router.get('/:ideaId', verifyPathParams(['ideaId']), ideaController.getIdeaById)

router.put('/:ideaId', verifyPathParams(['ideaId']), ideaController.editIdea)

router.delete('/:ideaId', verifyPathParams(['ideaId']), ideaController.deleteIdea)

router.get('/user/:userId', verifyPathParams(['userId']), ideaController.getIdeaByUserId)

router.patch('/:ideaId/vote', verifyPathParams(['ideaId']), ideaController.voteIdea)

router.post('/:ideaId/comments', verifyPathParams(['ideaId']), commentController.addComment)

router.get('/comments/:commentId', verifyPathParams(['commentId']), commentController.getReplies)

router.delete('/comments/:commentId', verifyPathParams(['commentId']), commentController.deleteComment)

router.put('/comments/:commentId', verifyPathParams(['commentId']), commentController.editComment)

export default router
