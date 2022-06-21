import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  ideaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'idea',
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

  body: {
    type: String,
    required: true
  }
})

const Comment = mongoose.model('comment', commentSchema)

export default Comment
