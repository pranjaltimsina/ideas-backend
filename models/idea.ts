import mongoose from 'mongoose'
import User from './user'

const Schema = mongoose.Schema

const ideaSchema = new Schema({
  title: String,
  description: String,
  upvotes: [{
    voter: User,
  }],
  downvotes: [{
    voter: String
  }]
})

const Idea = mongoose.model('idea', ideaSchema)

export default Idea
