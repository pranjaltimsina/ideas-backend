import { Request, Response } from 'express'
import Comment from '../models/comment'
import Idea from '../models/idea'

const getUserComments = async (req: Request, res: Response) => {
  const userId: string = res.locals.userId || ''

  try {
    const comments = await Comment.find({
      author: userId
    }).lean()

    return res.status(200).json({ comments })
  } catch {
    return res.status(500).json({ error: 'Could not fetch comments by user.' })
  }
}

const getUserIdeas = async (req: Request, res: Response) => {
  const userId: string = res.locals.userId || ''

  try {
    const ideas = await Idea.find({
      author: userId
    }).lean()

    return res.status(200).json({ ideas })
  } catch {
    return res.status(500).json({ error: 'Could not fetch ideas by user.' })
  }
}

const getUserProfile = (req: Request, res: Response) => {
  return res.status(501).end()
}

export {
  getUserComments,
  getUserIdeas,
  getUserProfile
}
