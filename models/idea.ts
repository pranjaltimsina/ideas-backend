import mongoose, { Types } from 'mongoose'
import User from './user'

const Schema = mongoose.Schema

interface IIdea {
  author: Types.ObjectId,
  title: String,
  description: String,
  upvotes: Types.ObjectId[],
  downvotes: Types.ObjectId[],
  tags: String[],
  createdOn: Date
}

const ideaSchema = new Schema<IIdea>({
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

  upvotes: [mongoose.Schema.Types.ObjectId],

  downvotes: [mongoose.Schema.Types.ObjectId],

  tags: [String],

  createdOn: Date
})

const Idea = mongoose.model('idea', ideaSchema)

export default Idea
