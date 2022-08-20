import mongoose from 'mongoose'
import { IComment, IMention } from '../types/types'

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

const Comment = mongoose.model('comment', commentSchema)

export default Comment
