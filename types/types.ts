import { Types } from 'mongoose'

interface IUser {
  name: String
  givenName: String
  familyName: String
  googleId: String
  email: String
  picture: String
}

interface IIdea {
  author: Types.ObjectId
  authorName: String
  title: String
  description: String
  upvotes: Types.ObjectId[] | String[]
  downvotes: Types.ObjectId[] | String[]
  tags: String[]
  approved: Boolean
  rejected: Boolean
  createdOn: Date
}

interface IComment {
  ideaId: Types.ObjectId | String
  ideaTitle: String
  parentCommentId?: Types.ObjectId | String
  author: Types.ObjectId | string
  authorName: String
  body: String
}

export {
  IUser,
  IIdea,
  IComment
}
