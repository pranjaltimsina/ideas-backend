import { IIdea } from '../types/types'

import fuzzysort from 'fuzzysort'

const filterIdeas = (ideas: any, sortBy: any, order: any, user: any, tags: any, query: any) => {
  // user filter
  if (user !== '') {
    ideas = ideas?.filter((idea: IIdea) => idea.authorName === user)
  }

  // search query fuzzy matching
  const results = fuzzysort.go(query, ideas, { keys: ['title', 'description', 'authorName', 'createdOn'] })
    .map((res) => {
      return { idea: res.obj, score: res.score }
    })

  switch (sortBy) {
    case 'title':
      ideas?.sort((a: IIdea, b: IIdea) => a.title.localeCompare(b.title))
      break
    case 'user':
      ideas?.sort((a: IIdea, b: IIdea) => a.authorName.localeCompare(b.authorName))
      break
    default:
      ideas?.sort((a: IIdea, b: IIdea) => a.createdOn < b.createdOn ? -1 : 1)
      break
  }

  switch (order) {
    case 'desc':
      ideas?.reverse()
      break
    default:
      break
  }

  // console.log(ideas)
  return {
    ideas,
    matches: results
  }
}

export default filterIdeas
