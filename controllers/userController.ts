import { Request, Response } from 'express'
import Comment from '../models/comment'
import Idea from '../models/idea'
import User from '../models/user'

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

const getUserProfile = async (req: Request, res: Response) => {
  const userId: string = res.locals.userId || ''

  try {
    const user = await User.findById(userId).lean()
    if (user === null) {
      return res.status(404).json({ error: 'User not found.' })
    }
    return res.status(200).json({ user })
  } catch {
    return res.status(500).json({ error: 'Could not fetch user data.' })
  }
}

export {
  getUserComments,
  getUserIdeas,
  getUserProfile
}
