import mongoose from 'mongoose'
import { ITag } from '../types/types'

const Schema = mongoose.Schema

const tagSchema = new Schema<ITag>({
  tag: {
    type: String,
    required: true
  }
}, {
  versionKey: false
})

const Tag = mongoose.model('tag', tagSchema)

export default Tag
