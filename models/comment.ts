import mongoose from 'mongoose'
import { IComment, IMention } from '../types/types'
import * as addNotification from '../utils/addNotification'
import { User } from './user'

const mentionSchema = new mongoose.Schema<IMention>({
  userName: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

const commentSchema = new mongoose.Schema<IComment>({
  ideaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'idea',
    required: true
  },

  ideaTitle: {
    type: String,
    required: true
  },

  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment',
    required: false
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },

  authorName: {
    type: String,
    required: true
  },

  body: {
    type: String,
    required: true
  },

  mentions: {
    type: [mentionSchema],
    required: false,
    default: []
  }
}, {
  versionKey: false
})

commentSchema.post('save', async (doc: mongoose.Document & IComment) => {
  // if a toplevel comment, add notification to the idea authors inbox
  // if a reply to the comment, add notification to the reply's parent comment's author
  // and the idea authors inbox
  // if the idea author and the reply'y parent comment's author are the same
  // add the replied to your comment notification only

  await User.findByIdAndUpdate({ _id: doc?.author }, { $inc: { commentCount: 1 } })

  if (doc?.parentCommentId) {
    await addNotification.addReplyNotification(doc)
  } else {
    await addNotification.addCommentNotification(doc)
  }
})

const Comment = mongoose.model('comment', commentSchema)

export default Comment
