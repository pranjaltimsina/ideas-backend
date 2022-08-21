import mongoose from 'mongoose'
import { IComment, IMention } from '../types/types'
import { User } from '../models/user'
import Idea from '../models/idea'
import Comment from '../models/comment'

const addMention = async (doc: IComment & mongoose.Document, mentionType: string) => {
  doc?.mentions?.length && doc?.mentions.forEach(async (mention: IMention) => {
    await addNotification(mention.userId, `${doc.authorName} mentioned you in a ${mentionType}.`, doc._id, 1)
  })
}

const addCommentNotification = async (doc: IComment & mongoose.Document) => {
  await addMention(doc, 'comment')

  const ideaAuthor = await Idea.findById(doc.ideaId).select('author').lean()
  await addNotification(ideaAuthor?._id, `${doc.authorName} added a comment to your idea`, doc._id, 1)
}

const addReplyNotification = async (doc: IComment & mongoose.Document) => {
  await addMention(doc, 'reply')
  const ideaAuthor = await Idea.findById(doc.ideaId).select('author').lean()
  await addNotification(ideaAuthor?._id, `${doc.authorName} replied to a comment in your idea.`, doc._id, 1)
  const parentCommentAuthor = await Comment.findById(doc?.parentCommentId).select('author').lean()
  await addNotification(parentCommentAuthor?._id, `${doc.authorName} replied to your comment.`, doc._id, 1)
}

const addNotification = async (userId: mongoose.Types.ObjectId | undefined, body: String, source: mongoose.Types.ObjectId, notificationType: Number = 1) => {
  const notification = {
    createdOn: Date.now(),
    body,
    source,
    notificationType,
    read: false
  }

  try {
    await User.updateOne({ _id: userId }, { $push: { notifications: notification } })
  } catch (e) {
    console.error(e)
  }
}

export {
  addMention,
  addCommentNotification,
  addReplyNotification
}
