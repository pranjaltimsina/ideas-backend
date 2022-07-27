import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Comment from '../models/comment'
import Idea from '../models/idea'
import User from '../models/user'

const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.find().select({ givenName: 0, familyName: 0, googleId: 0, email: 0, __v: 0 }).lean()
    return res.status(200).json({ users })
  } catch {
    return res.status(502).json({ error: 'Could not retrieve users.' })
  }
}

const getUserComments = async (req: Request, res: Response): Promise<Response> => {
  const userId: string = res.locals.userId || ''

  try {
    const comments = await Comment.find({
      author: userId
    }).lean()

    const picture = await User.findById(userId).select('picture').lean()

    return res.status(200).json({ comments, picture: picture?.picture })
  } catch {
    return res.status(500).json({ error: 'Could not fetch comments by user.' })
  }
}

const getUserIdeas = async (req: Request, res: Response): Promise<Response> => {
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

const getUnapprovedIdeas = async (req: Request, res: Response): Promise<Response> => {
  const userId: string = res.locals.userId || ''
  const authorizationId: string = res.locals.user.id || ''

  if (!new mongoose.Types.ObjectId(userId).equals(authorizationId)) {
    return res.status(404).json({ error: 'Bad Request. You can only get your own unapproved ideas.' })
  }

  try {
    const unapprovedIdeas = await Idea.find({
      author: userId,
      approved: false
    }).lean()

    return res.status(200).json({
      unapprovedIdeas
    })
  } catch {
    return res.status(500).json({ error: 'Could not fetch unapproved ideas.' })
  }
}

const getUserProfile = async (req: Request, res: Response): Promise<Response> => {
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
  getAllUsers,
  getUserComments,
  getUserIdeas,
  getUnapprovedIdeas,
  getUserProfile
}
