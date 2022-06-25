import { Request, Response } from 'express'

import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

import { IComment, IUser } from '../types/types'
import Comment from '../models/comment'
import User from '../models/user'

const getReplies = async (req: Request, res: Response) => {
  const commentId = req.params.commentId || ''

  if (!mongoose.isValidObjectId(commentId)) {
    return res.status(400).json({error: "Bad Request. Invalid comment id."})
  }

  const mongoCommentId = new mongoose.Types.ObjectId(commentId)

  try {
    const replies = await Comment.find({
      parentCommentId: mongoCommentId
    }).lean()
    return res.status(200).json({replies: replies})
  } catch {
    return res.status(500).json({error: "Could not get replies."})
  }
}

const addComment = async (req: Request, res: Response) => {
  const ideaId: string = req.params.ideaId

  if (!mongoose.isValidObjectId(ideaId)) {
    return res.status(400).json({error: 'Bad request. Invalid ideaId.'})
  }

  const mongoIdeaId = new mongoose.Types.ObjectId(ideaId)
  const userId: string = jwt.decode(res.locals.authorization || '')?.toString() || ''

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({error: "Bad request. Invalid auth token."})
  }

  const mongoUserId = new mongoose.Types.ObjectId(userId)

  const user: IUser = await User.findById(mongoUserId).lean()

  if (!user) {
    return res.status(500).json({error: "Could not create comment."})
  }

  const userName = user.name

  let commentBody:string = req.body.commentBody || ''

  commentBody = commentBody.trim()

  if (commentBody === '') {
    return res.status(400).json({error: 'Bad request. Comment body is empty.'})
  }


  let parentCommentId = req.body.parentCommentId || ''

  if (parentCommentId === '') {
    const comment: IComment = {
      authorName: userName,
      ideaId: mongoIdeaId,
      author: mongoUserId,
      body: commentBody
    }
    try {
      const createdComment = await new Comment(
        comment
      ).save()
      return res.status(200).json({message: 'Successfully added comment.', comment: createdComment})
    } catch {
      return res.status(500).json({error: "Could not create commennt."})
    }
  } else {
    if (!mongoose.isValidObjectId(parentCommentId)) {
      return res.status(400).json({error: "Bad request. Invalid parent commentId."})
    }

    const mongoParentCommentId = new mongoose.Types.ObjectId(parentCommentId)

    const parentComment = Comment.findById(mongoParentCommentId)

    if (!parentComment) {
      return res.status(400).json({error: "Bad request. Parent comment does not exist."})
    }

    const comment: IComment = {
      authorName: userName,
      ideaId: mongoIdeaId,
      author: mongoUserId,
      body: commentBody,
      parentCommentId: mongoParentCommentId
    }
    try {
      const createdComment = await new Comment(
        comment
      ).save()
      return res.status(200).json({message: 'Successfully added comment.', comment: createdComment})
    } catch {
      return res.status(500).json({error: "Could not create commennt."})
    }
  }
}

const deleteComment = async (req: Request, res: Response) => {

}

const editComment = async (req: Request, res: Response) => {

}

export {
  addComment,
  deleteComment,
  editComment,
  getReplies
}
