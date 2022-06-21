import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Document } from 'mongoose'

import Idea from '../models/idea'

const getAllIdeas = async (req: Request, res: Response) => {
  try {
    const ideas = await Idea.find().lean()
    res.status(200).json({ideas: ideas})
  } catch {
    res.status(502).json({error: "Could not retrieve ideas from the database."})
  }
}

interface reqIdea {
  title: string,
  description: string,
  tags?: string[],
  upvotes?: { voterId: string }[],
  downvotes?: { voterId: string }[],
  comments ?: any
}

const createIdea = async (req: Request, res: Response) => {
  try {

    const userId:string =  jwt.decode(req.headers.authorization || '')?.toString() || ''

    try {

      const idea: reqIdea = req.body.idea

      if (!idea.title) {
        return res.status(400).json({error: "Bad request. Title of the idea is missing"})
      }

      idea.title = idea.title.trim()

      if (!idea.description) {
        return res.status(400).json({error: "Bad request. Description of the idea is missing"})
      }

      idea.description = idea.description.trim()

      try {
        if (idea.tags) {
          idea.tags.map(tag => {
            tag.trim().toLowerCase()
          });
        }
      } catch {
        return res.status(400).json({error: "Bad request. Error parsing idea tags."})
      }

      idea.downvotes = []
      idea.upvotes = [{
        voterId: userId
      }]

      try {
        const createdIdea = await new Idea({
          userId: userId,
          title: idea.title,
          description: idea.description,
          upvotes: idea.upvotes,
          downvotes: idea.downvotes,
          tags: idea.tags,
          createdOn: Date.now()
        }).save()
        return res.status(200).json({idea: createdIdea, message: 'Looks like an idea was created'})
      } catch {
        return res.status(502).json({error: "Error inserting idea in the database."})
      }
    } catch {
      return res.status(400).json({error: "Bad request. Request body does not have an idea, or the idea is invalid."})
    }
  } catch {
    return res.status(401).json({error: "Unauthorized."})
  }

}

const editIdea = (req: Request, res: Response) => {
  return res.status(501).json({error: "Not implemented"})
}

const deleteIdea = (req: Request, res: Response) => {
  return res.status(501).json({error: "Not implemented"})
}


const resetVote = async (userId: string, idea: any) => {
  // if (!userId) return
  console.log(idea.upvotes)
  console.log(`Finding userId ${userId}`)
}

const voteIdea = async (req: Request, res: Response) => {

  const userId: string = jwt.decode(req.headers.authorization || '')?.toString() || ''

  if (!userId) {
    res.status(400).json({error: "Bad request. Invalid auth token."})
  } else {
    try {
      const ideaId: string = req.params.ideaId
      if (!ideaId) {
        res.status(400).json({error: "Invalid idea ID."})
      } else {
        try {
          const theIdea: Document | null = await Idea.findById(ideaId)
          // console.log(theIdea)
          let voteType = req.body.voteType
          if (typeof voteType === 'string') {
            voteType = parseInt(voteType)
          }
          switch (voteType) {
            case 0:
              await resetVote(userId, theIdea)
              console.log('Removing upvote/downvote')
              res.status(200).json({message: "Removing upvote/downvote"})
              break

              case 1:
              await resetVote(userId, theIdea)
              console.log('Adding upvote and ? downvote')
              res.status(200).json({message: "Updating vote count"})
              break

              case 2:
              await resetVote(userId, theIdea)
              console.log('Updating votecount')
              res.status(200).json({message: "Updating vote count"})
              break

            default:
              res.status(400).json({error: "Bad request. Invalid voteType."})
              break
          }
        } catch {
          res.status(404).json({error: `Idea with id ${ideaId} not found.`})
        }
      }
    } catch {
      res.status(400).json({ error: "Bad request. Invalid request body" })
    }
  }
}


export {
  getAllIdeas,
  createIdea,
  editIdea,
  deleteIdea,
  voteIdea
}
