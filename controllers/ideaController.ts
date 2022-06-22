import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import mongoose,  { isValidObjectId } from 'mongoose'

import Idea from '../models/idea'
import { IIdea } from '../types/types'

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
  upvotes?: any,
  downvotes?: any,
  comments ?: any
}

const createIdea = async (req: Request, res: Response) => {
  try {

    const userId:string =  jwt.decode(res.locals.authorization || '')?.toString() || ''
    const userObjectId = new mongoose.Types.ObjectId(userId)
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
      idea.upvotes = [userObjectId]

      try {
        const createdIdea = await new Idea({
          author: userObjectId,
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

const deleteIdea = async (req: Request, res: Response) => {
  // get user id
  const userId: string = jwt.decode(res.locals.authorization || '')?.toString() || ''
  if (!mongoose.isValidObjectId(userId)) {
    res.status(400).json({error: "Bad request. Invalid auth token."})
  } else {
    const mongoUserId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userId)
    try {
      const ideaId: string = req.params.ideaId

      if (!mongoose.isValidObjectId(ideaId)) {
        res.status(400).json({error: "Invalid idea Id."})
      } else {
        const mongoIdeaId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(ideaId)
        // check if idea id and user id is the same
        const theIdea: IIdea | null  = await Idea.findById(mongoIdeaId)
        if (!theIdea) {
          res.status(404).json({error: `Idea with ideaId ${mongoIdeaId} not found.`})
        } else {
          console.log(theIdea.author)
          console.log(mongoUserId)
          if (mongoUserId.equals(theIdea.author)) {
            try {
              await Idea.deleteOne({_id: mongoIdeaId})
              res.status(200).json({message: 'Deleted Idea'})
            } catch {
              res.status(500).json({error: 'Could not delete Idea.'})
            }
          } else {
            res.status(401).json({error: 'Unauthorized.'})
          }
        }
      }
    } catch {
      res.status(500).json({error: "Unable to fulfill request due to some error"})
    }
  }
}


const resetVote = async (mongoUserId: mongoose.Types.ObjectId, mongoIdeaId: mongoose.Types.ObjectId) => {
  return await Idea.updateOne({ _id: mongoIdeaId}, {
    $pull: {
      upvotes: mongoUserId,
      downvotes: mongoUserId
    }
  })
}

const voteIdea = async (req: Request, res: Response) => {

  const userId: string = jwt.decode(res.locals.authorization || '')?.toString() || ''

  if (!mongoose.isValidObjectId(userId)) {
    res.status(400).json({error: "Bad request. Invalid auth token."})
  } else {
    const mongoUserId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userId)
    try {
      const ideaId: string = req.params.ideaId

      if (!mongoose.isValidObjectId(ideaId)) {
        res.status(400).json({error: "Invalid idea Id."})
      } else {
        const mongoIdeaId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(ideaId)
        try {
          let voteType = req.body.voteType
          if (typeof voteType === 'string') {
            voteType = parseInt(voteType)
          }
          let result
          let theIdea: IIdea | null
          switch (voteType) {
            case 0:
              result = await resetVote(mongoUserId, mongoIdeaId)
              console.log(result)
              theIdea = await Idea.findById(mongoIdeaId)
              res.status(200).json({message: "Removed upvote/downvote", idea: theIdea})
              break

            case 1:
              result = await resetVote(mongoUserId, mongoIdeaId)
              console.log(result)
              result = await Idea.updateOne({ _id: mongoIdeaId}, {
                $push: {
                  upvotes: mongoUserId,
                }
              })
              console.log(result)
              theIdea = await Idea.findById(mongoIdeaId)
              res.status(200).json({message: "Added upvote", idea: theIdea})
              break

            case 2:
              result = await resetVote(mongoUserId, mongoIdeaId)
              console.log(result)
              result = await Idea.updateOne({ _id: mongoIdeaId}, {
                $push: {
                  downvotes: mongoUserId,
                }
              })
              console.log(result)
              theIdea = await Idea.findById(mongoIdeaId)
              console.log(theIdea)
              res.status(200).json({message: "Added downvote", idea: theIdea})
              break

            default:
              res.status(400).json({error: "Bad request. Invalid voteType."})
              break
          }
        } catch (err) {
          console.log(err)
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
