import { Types } from 'mongoose'

interface IUser {
  name: String,
  givenName: String,
  familyName: String,
  googleId: String,
  email: String,
  picture: String
}

interface IIdea {
  author: Types.ObjectId,
  title: String,
  description: String,
  upvotes: Types.ObjectId[],
  downvotes: Types.ObjectId[],
  tags: String[],
  createdOn: Date
}

interface IComment {
  ideaId: Types.ObjectId,
  parentCommentId: Types.ObjectId,
  author: Types.ObjectId,
  body: String
}

export {
  IUser,
  IIdea,
  IComment
}
