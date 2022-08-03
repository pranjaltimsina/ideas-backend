import { Types } from 'mongoose'

interface IUser {
  name: string
  givenName: string
  familyName: string
  googleId: string
  email: string
  picture: string
}

interface IIdea {
  author: Types.ObjectId
  authorName: string
  title: string
  description: string
  upvotes: Types.ObjectId[] | string[]
  downvotes: Types.ObjectId[] | string[]
  tags: string[]
  approved: Boolean
  rejected: Boolean
  createdOn: Date
}

interface IComment {
  ideaId: Types.ObjectId | string
  ideaTitle: string
  parentCommentId?: Types.ObjectId | string
  author: Types.ObjectId | string
  authorName: string
  body: string
}

export {
  IUser,
  IIdea,
  IComment
}
