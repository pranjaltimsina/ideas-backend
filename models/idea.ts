import mongoose from 'mongoose'
import User from './user'

const Schema = mongoose.Schema

const ideaSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  upvotes: [{
    voterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
  }],

  downvotes: [{
    voterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
  }],

  tags: [String],

  createdOn: Date
})

const Idea = mongoose.model('idea', ideaSchema)

export default Idea
