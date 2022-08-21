import { Request, Response } from 'express'

import mongoose from 'mongoose'

import { IComment, IIdea, IMention } from '../types/types'
import Comment from '../models/comment'
import { User } from '../models/user'
import Idea from '../models/idea'

const getReplies = async (req: Request, res: Response) => {
  const commentId = req.params.commentId || ''

  try {
    const replies = await Comment.find({
      parentCommentId: commentId
    }).populate('author', 'picture name').lean()

    return res.status(200).json({ replies })
  } catch {
    return res.status(500).json({ error: 'Could not get replies.' })
  }
}

const addComment = async (req: Request, res: Response) => {
  const ideaId: string = req.params.ideaId

  const theIdea = await Idea.findById(ideaId)
  const ideaTitle = theIdea?.title || ''

  const userId: string = res.locals.user.id || ''
  const userName: string = res.locals.user.name || ''

  const user = await User.exists({ _id: userId })

  if (user === null) {
    return res.status(500).json({ error: 'Could not create comment.' })
  }

  let commentBody: string
  try {
    commentBody = req.body.commentBody || ''
  } catch {
    return res.status(400).json({ error: 'Bad Request. Comment Body missing.' })
  }

  commentBody = commentBody.trim()
  if (commentBody === '') {
    return res.status(400).json({ error: 'Bad request. Comment body is empty.' })
  }

  const parentCommentId = req.body.parentCommentId || ''

  if (parentCommentId === '') {
    // If there is no parent comment id (top level comment)

    // check for mentions

    let mentions: IMention[] = req.body?.mentions || []

    mentions = mentions.map((mention: any) => {
      return {
        userId: mention._id,
        userName: mention?.userName || mention?.username
      }
    })

    let comment: IComment
    if (mentions.length === 0) {
      comment = {
        authorName: userName,
        ideaId,
        ideaTitle,
        author: userId,
        body: commentBody
      }
    } else {
      comment = {
        authorName: userName,
        ideaId,
        ideaTitle,
        author: userId,
        body: commentBody,
        mentions
      }
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
    // If there is a parent comment id (reply to a comment)

    if (!mongoose.isValidObjectId(parentCommentId)) {
      return res.status(400).json({ error: 'Bad request. Invalid parent commentId.' })
    }

    const parentComment = Comment.findById(parentCommentId)

    if (!parentComment) {
      return res.status(400).json({ error: 'Bad request. Parent comment does not exist.' })
    }

    let mentions: IMention[] = req.body?.mentions || []

    mentions = mentions.map((mention: any) => {
      return {
        userId: mention._id,
        userName: mention?.userName || mention?.username
      }
    })

    let comment: IComment
    if (mentions.length === 0) {
      comment = {
        authorName: userName,
        ideaId,
        ideaTitle,
        author: userId,
        body: commentBody,
        parentCommentId
      }
    } else {
      comment = {
        authorName: userName,
        ideaId,
        ideaTitle,
        author: userId,
        body: commentBody,
        mentions,
        parentCommentId
      }
    }
    try {
      const createdComment = await new Comment(
        comment
      ).save()
      return res.status(200).json({ message: 'Successfully added comment.', comment: createdComment })
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: 'Could not create comment.' })
    }
  }
}

const deleteComment = async (req: Request, res: Response) => {
  const userId: string = res.locals.user.id || ''
  const commentId: string = res.locals.commentId || ''

  const theIdea: IIdea | null = await Comment.findById(commentId)

  if (theIdea === null) {
    return res.status(404).json({ error: 'Bad Request. Comment not found.' })
  }

  if (theIdea.author.equals(userId)) {
    try {
      await Comment.deleteOne({ _id: commentId, author: userId })
      return res.status(200).json({ message: 'Deleted comment successfully.' })
    } catch {
      return res.status(500).json({ error: 'Could not delete idea.' })
    }
  }

  return res.status(401).json({ error: 'Unauthorized. You cannot delete a comment created by someone else.' })
}

const editComment = async (req: Request, res: Response) => {
  const userId: string = res.locals.user.id || ''
  const commentId: string = res.locals.commentId || ''

  const theComment: IComment | null = await Comment.findById(commentId)

  if (theComment === null) {
    return res.status(404).json({ error: 'Could not find comment' })
  }

  if (!new mongoose.Types.ObjectId(theComment.author).equals(userId)) {
    return res.status(401).json({ error: 'Unauthorized. You cannot edit a comment created by someone else.' })
  }

  try {
    const newBody: string = req.body.commentBody.trim() || ''

    if (newBody === '') {
      return res.status(400).json({ error: 'Bad Request. Comment body cannot be empty' })
    }
    try {
      const newComment = await Comment.findByIdAndUpdate(commentId, {
        body: newBody
      }, { new: true })

      return res.status(200).json({ message: 'Successfully updated comment.', comment: newComment })
    } catch {
      return res.status(500).json({ error: 'Could not update comment.' })
    }
  } catch {
    return res.status(400).json({ error: 'Bad Request. Comment body missing.' })
  }
}

export {
  addComment,
  deleteComment,
  editComment,
  getReplies
}
