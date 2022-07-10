import express, { Router } from 'express'

import jwt from '../middlewares/jwt'

import * as ideaController from '../controllers/ideaController'
import * as commentController from '../controllers/commentController'
import verifyParams from '../middlewares/verifyParams'

const router: Router = express.Router()

router.use(jwt)

router.get('/', ideaController.getAllIdeas)

router.post('/', ideaController.createIdea)

router.get('/:ideaId', verifyParams(['ideaId']), ideaController.getIdeaById)

router.put('/:ideaId', verifyParams(['ideaId']), ideaController.editIdea)

router.delete('/:ideaId', verifyParams(['ideaId']), ideaController.deleteIdea)

router.get('/user/:userId', verifyParams(['userId']), ideaController.getIdeaByUserId)

router.patch('/:ideaId/vote', verifyParams(['ideaId']), ideaController.voteIdea)

router.post('/:ideaId/comments', verifyParams(['ideaId']), commentController.addComment)

router.get('/comments/:commentId', verifyParams(['commentId']), commentController.getReplies)

router.delete('/comments/:commentId', verifyParams(['commentId']), commentController.deleteComment)

router.put('/comments/:commentId', verifyParams(['commentId']), commentController.editComment)

export default router
