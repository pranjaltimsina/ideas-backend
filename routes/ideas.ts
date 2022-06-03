import express, { Request, Response, Router } from 'express'
import jwt from '../middlewares/jwt'

const router: Router = express.Router()

router.use(jwt)

router.get('/all', (req: Request, res: Response) => {
  res.status(200).json({
    ideas: [
      'idea 1'
    ]
  })
})

router.post('/create', (req: Request, res: Response) => {

})

router.post('/edit', (req: Request, res: Response) => {

})

router.post('/upvote', (req: Request, res: Response) => {

})

router.post('/downvote', (req: Request, res: Response) => {

})

export default router
