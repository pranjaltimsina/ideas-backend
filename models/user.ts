import mongoose from 'mongoose'
import { IUser, INotification } from '../types/types'

const Schema = mongoose.Schema

const notificationsSchema = new Schema<INotification>({
  createdOn: {
    type: Date,
    required: true
  },

  body: {
    type: String,
    required: true
  },

  source: {
    type: String,
    required: true
  },

  notificationType: {
    type: Number,
    required: true
  },

  read: {
    type: Boolean,
    required: true,
    default: false
  }
})

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true
  },
  givenName: {
    type: String,
    required: true
  },
  familyName: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: true
  },
  notifications: {
    type: [notificationsSchema],
    required: true,
    default: []
  }
}, {
  versionKey: false
})

const User = mongoose.model('user', userSchema)

export { User, notificationsSchema }
