import { Request, Response } from 'express'
import Comment from '../models/comment'

const getUserComments = async (req: Request, res: Response) => {
  const userId: string = res.locals.userId || ''

  const comments = await Comment.find({
    author: userId
  }).lean()

  console.log(comments)

  return res.status(501).end()
}

const getUserIdeas = (req: Request, res: Response) => {
  return res.status(501).end()
}

const getUserProfile = (req: Request, res: Response) => {
  return res.status(501).end()
}

export {
  getUserComments,
  getUserIdeas,
  getUserProfile
}
