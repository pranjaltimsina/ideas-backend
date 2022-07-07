import { Request, Response } from 'express'

import mongoose from 'mongoose'

import { IComment, IIdea } from '../types/types'
import Comment from '../models/comment'
import User from '../models/user'
import Idea from '../models/idea'

const getReplies = async (req: Request, res: Response) => {
  const commentId = req.params.commentId || ''

  if (!mongoose.isValidObjectId(commentId)) {
    return res.status(400).json({ error: 'Bad Request. Invalid comment id.' })
  }

  const mongoCommentId = new mongoose.Types.ObjectId(commentId)

  try {
    const replies = await Comment.find({
      parentCommentId: mongoCommentId
    }).lean()
    return res.status(200).json({ replies })
  } catch {
    return res.status(500).json({ error: 'Could not get replies.' })
  }
}

const addComment = async (req: Request, res: Response) => {
  const ideaId: string = req.params.ideaId

  if (!mongoose.isValidObjectId(ideaId)) {
    return res.status(400).json({ error: 'Bad request. Invalid ideaId.' })
  }

  const mongoIdeaId = new mongoose.Types.ObjectId(ideaId)

  const theIdea = await Idea.findById(mongoIdeaId)
  const ideaTitle = theIdea?.title || ''

  const userId: string = res.locals.user.id || ''
  const userName: string = res.locals.user.name || ''

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ error: 'Bad request. Invalid auth token.' })
  }

  const mongoUserId = new mongoose.Types.ObjectId(userId)

  const user = await User.exists({ _id: mongoUserId })

  if (user === null) {
    return res.status(500).json({ error: 'Could not create comment.' })
  }

  let commentBody: string = req.body.commentBody || ''

  commentBody = commentBody.trim()

  if (commentBody === '') {
    return res.status(400).json({ error: 'Bad request. Comment body is empty.' })
  }

  const parentCommentId = req.body.parentCommentId || ''

  if (parentCommentId === '') {
    const comment: IComment = {
      authorName: userName,
      ideaId: mongoIdeaId,
      ideaTitle,
      author: mongoUserId,
      body: commentBody
    }
    try {
      const createdComment = await new Comment(
        comment
      ).save()
      return res.status(200).json({ message: 'Successfully added comment.', comment: createdComment })
    } catch {
      return res.status(500).json({ error: 'Could not create comment.' })
    }
  } else {
    if (!mongoose.isValidObjectId(parentCommentId)) {
      return res.status(400).json({ error: 'Bad request. Invalid parent commentId.' })
    }

    const mongoParentCommentId = new mongoose.Types.ObjectId(parentCommentId)

    const parentComment = Comment.findById(mongoParentCommentId)

    if (!parentComment) {
      return res.status(400).json({ error: 'Bad request. Parent comment does not exist.' })
    }

    const comment: IComment = {
      authorName: userName,
      ideaId: mongoIdeaId,
      ideaTitle,
      author: mongoUserId,
      body: commentBody,
      parentCommentId: mongoParentCommentId
    }
    try {
      const createdComment = await new Comment(
        comment
      ).save()
      return res.status(200).json({ message: 'Successfully added comment.', comment: createdComment })
    } catch {
      return res.status(500).json({ error: 'Could not create comment.' })
    }
  }
}

const deleteComment = async (req: Request, res: Response) => {
  const userId: string = res.locals.user.id || ''

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ error: 'Bad request. Invalid auth token.' })
  }

  const mongoUserId = new mongoose.Types.ObjectId(userId)

  const commentId: string = req.params.commentId

  if (!mongoose.isValidObjectId(commentId)) {
    return res.status(400).json({ error: 'Bad request. Invalid comment id.' })
  }

  const mongoCommentId = new mongoose.Types.ObjectId(commentId)

  const theIdea: IIdea | null = await Comment.findById(mongoCommentId)
  if (theIdea === null) {
    return res.status(404).json({ error: 'Bad Request. Comment not found.' })
  } else {
    if (mongoCommentId.equals(theIdea.author)) {
      try {
        await Comment.deleteOne({ _id: mongoCommentId, author: mongoUserId })
        return res.status(200).json({ message: 'Deleted Comment.' })
      } catch {
        return res.status(500).json({ error: 'Could not delete idea.' })
      }
    } else {
      return res.status(401).json({ error: 'Unauthorized.' })
    }
  }
}

const editComment = async (req: Request, res: Response) => {
  const userId: string = res.locals.user.id || ''

  if (!mongoose.isValidObjectId(userId)) {
    res.status(400).json({ error: 'Bad request. Invalid auth token.' })
  }

  const mongoUserId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userId)

  const commentId: string = req.params.commentId || ''

  if (!mongoose.isValidObjectId(commentId)) {
    return res.status(400).json({ error: 'Invalid comment Id.' })
  }
  const mongoCommentId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(commentId)

  const theComment: IComment | null = await Comment.findById(mongoCommentId)

  if (theComment === null) {
    return res.status(404).json({ error: 'Could not find comment' })
  }

  if (!mongoUserId.equals(theComment.author)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const newBody: string = req.body.commentBody.trim() || ''

  if (newBody === '') {
    return res.status(400).json({ error: 'Bad Request. Comment body cannot be empty' })
  }
  try {
    const newComment = await Comment.findByIdAndUpdate(mongoCommentId, {
      body: newBody
    }, { new: true })

    return res.status(200).json({ message: 'Successfully updated comment.', comment: newComment })
  } catch {
    return res.status(500).json({ error: 'Could not update comment.' })
  }
}

export {
  addComment,
  deleteComment,
  editComment,
  getReplies
}
