import mongoose from 'mongoose'
import User from './user'

const Schema = mongoose.Schema

const ideaSchema = new Schema({
  userId: String,
  title: String,
  description: String,
  upvotes: [{
    voterId: String,
  }],
  downvotes: [{
    voterId: String
  }],
  tags: [String],
  createdOn: Date
})

const Idea = mongoose.model('idea', ideaSchema)

export default Idea
