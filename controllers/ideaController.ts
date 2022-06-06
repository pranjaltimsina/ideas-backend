import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

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
        await new Idea({
          userId: userId,
          title: idea.title,
          description: idea.description,
          upvotes: idea.upvotes,
          downvotes: idea.downvotes,
          tags: idea.tags
        }).save()
      } catch {
        return res.status(502).json({error: "Error inserting idea in the database."})
      }
      return res.status(200).json({idea: idea, message: 'Looks like an idea was created'})
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

const voteIdea = (req: Request, res: Response) => {
  return res.status(501).json({error: "Not implemented"})
}


export {
  getAllIdeas,
  createIdea,
  editIdea,
  deleteIdea,
  voteIdea
}
