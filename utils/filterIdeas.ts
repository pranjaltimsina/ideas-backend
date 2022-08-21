import { IIdea } from '../types/types'

import fuzzysort from 'fuzzysort'

const filterIdeas = (ideas: any, sortBy: any, order: any, user: any, tags: any, query: any, trending: any, madeReal: any) => {
  // user filter
  if (trending === 'true') {
    sortBy = 'upvotes'
    return { ideas: ideas?.sort((a: IIdea, b: IIdea) => a.upvotes.length < b.upvotes.length) }
  }

  if (madeReal === 'true') {
    return { ideas }
  }

  if (user !== '') {
    ideas = { ideas: ideas?.filter((idea: IIdea) => idea.authorName === user) }
  }

  let results
  // search query fuzzy matching
  if (query !== '') {
    results = fuzzysort.go(query, ideas, { keys: ['title', 'description', 'authorName', 'createdOn'] })
      .map((res) => {
        return { idea: res.obj, score: res.score }
      })
  }

  switch (sortBy) {
    case 'title':
      ideas?.sort((a: IIdea, b: IIdea) => a.title.localeCompare(b.title))
      break
    case 'user':
      ideas?.sort((a: IIdea, b: IIdea) => a.authorName.localeCompare(b.authorName))
      break
    case 'upvotes':
      ideas?.sort((a: IIdea, b: IIdea) => a.upvotes.length < b.upvotes.length)
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

  return {
    ideas,
    matches: results
  }
}

export default filterIdeas
