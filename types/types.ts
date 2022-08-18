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
  _id: Types.ObjectId
  author: Types.ObjectId
  authorName: string
  title: string
  description: string
  upvotes: Types.ObjectId[] | string[]
  downvotes: Types.ObjectId[] | string[]
  tags: string[]
  gitLinks?: string[]
  deployedURLs?: string[]
  approved: Boolean
  rejected: Boolean
  madeReal?: Boolean
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

interface ITag {
  tagId: Types.ObjectId | string
  tag: string
}

export {
  IUser,
  IIdea,
  IComment,
  ITag
}
