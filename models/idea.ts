import mongoose from 'mongoose'
import { IIdea } from '../types/types'

const Schema = mongoose.Schema

const ideaSchema = new Schema<IIdea>({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },

  authorName: {
    type: String,
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

  upvotes: [mongoose.Schema.Types.ObjectId],

  downvotes: [mongoose.Schema.Types.ObjectId],

  tags: [String],

  approved: {
    type: Boolean,
    required: true
  },

  createdOn: Date
}, {
  collection: 'ideas-db',
  versionKey: false
})

const Idea = mongoose.model('idea', ideaSchema)

export default Idea
