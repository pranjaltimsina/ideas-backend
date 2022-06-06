import express, { NextFunction, Request, Response, Router } from 'express'

import jwt from '../middlewares/jwt'
import * as ideaController from '../controllers/ideaController'

const router: Router = express.Router()

router.use(jwt)

router.get('/', ideaController.getAllIdeas)

router.post('/', ideaController.createIdea)

router.put('/:ideaId', ideaController.editIdea)

router.delete('/:ideaId', ideaController.deleteIdea)

router.patch('/:ideaId/vote', ideaController.voteIdea)

export default router
