import mongoose from 'mongoose'
import { IIdea } from '../types/types'
import Tag from './tags'

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

  rejected: {
    type: Boolean,
    required: true
  },

  createdOn: Date
}, {
  versionKey: false
})

ideaSchema.post('save', async (doc: mongoose.Document & IIdea) => {
  if (doc?.tags.length) {
    doc?.tags.forEach(async tag => {
      if (!(await Tag.exists({ tag }))) {
        console.log('New Tag', tag)
        try {
          await new Tag({ tag }
          ).save()
        } catch {
          console.error(`Could not save tag ${tag}`)
        }
      }
    })
  } else {
    console.log('No Tags')
  }
})

const Idea = mongoose.model('idea', ideaSchema)

export default Idea
