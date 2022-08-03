import mongoose from 'mongoose'
import { IIdea } from '../types/types'

const filterIdeas = (ideas: Omit<mongoose.Document<unknown, any, IIdea> & IIdea & { _id: mongoose.Types.ObjectId;}, never>[] | undefined, sortBy: any, order: any, user: any, tags: any) => {
  switch (sortBy) {
    case 'title':
      ideas?.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'user':
      ideas?.sort((a, b) => a.authorName.localeCompare(b.authorName))
      break
    default:
      ideas?.sort((a, b) => a.createdOn < b.createdOn ? -1 : 1)
      break
  }

  switch (order) {
    case 'desc':
      ideas?.reverse()
      break
    default:
      break
  }

  // user filter
  if (user !== '') {
    ideas = ideas?.filter((idea) => idea.authorName === user)
  }

  console.log(ideas)
  return ideas
}

export default filterIdeas
