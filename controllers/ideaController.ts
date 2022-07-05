import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import mongoose, { mongo } from 'mongoose'
import Comment from '../models/comment'

import Idea from '../models/idea'
import User from '../models/user'
import { IIdea, IUser } from '../types/types'

const getAllIdeas = async (req: Request, res: Response) => {
  try {
    const ideas = await Idea.find().lean()
    res.status(200).json({ideas: ideas})
  } catch {
    res.status(502).json({error: "Could not retrieve ideas from the database."})
  }
}

const getIdeaById = async (req: Request, res: Response) => {
  const ideaId: string = req.params.ideaId

  if (!mongoose.isValidObjectId(ideaId)) {
    return res.status(400).json({error: "Bad Request. Invalid Idea Id."})
  }
  const mongoIdeaId = new mongoose.Types.ObjectId(ideaId)
  try {
    const idea = await Idea.findById(ideaId).lean()

    const comments = await Comment.find({
      ideaId: mongoIdeaId,
      parentCommentId : { "$exists" : false }
    }).lean()
    console.log(idea)
    console.log(comments)

    return res.status(200).json({idea: idea, comments: comments})
  } catch {
    return res.status(500).json({error: "Could not find idea."})
  }
}

const getIdeaByUserId = async (req: Request, res: Response) => {
  const userId = req.params.userId

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({error: "Bad request. Invalid user id."})
  }

  const mongoUserId = new mongoose.Types.ObjectId(userId)

  try {
    const ideas = await Idea.find({
      author: mongoUserId
    }).lean()

    return res.status(200).json({ideas: ideas})
  } catch {
    return res.status(500).json({error: 'Could not fetch ideas.'})
  }
}

interface reqIdea {
  _id?: string,
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

    const user: IUser | null= await User.findById(userObjectId).lean()

    if (user === null) {
      return res.status(404).json({error: "Unauthorized. User Does not exist."})
    }

    const userName = user.name

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
          authorName: userName,
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

const editIdea = async (req: Request, res: Response) => {
  const userId: string = jwt.decode(res.locals.authorization || '')?.toString() || ''

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({error: "Bad request. Invalid auth token."})
  } else {
    const mongoUserId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userId)
    try {
      const ideaId: string = req.params.ideaId

      if (!mongoose.isValidObjectId(ideaId)) {
        return res.status(400).json({error: "Invalid idea Id."})
      } else {
        const mongoIdeaId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(ideaId)
        // check if idea id and user id is the same
        const theIdea: IIdea | null  = await Idea.findById(mongoIdeaId)
        if (!theIdea) {
          res.status(404).json({error: `Idea with ideaId ${mongoIdeaId} not found.`})
        } else {
          if (mongoUserId.equals(theIdea.author)) {
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
                idea.downvotes = []
                idea.upvotes = [mongoUserId]

                /*
                Update the idea
                */
               try {
                  const result = await Idea.updateOne({
                    _id: mongoIdeaId
                  }, {
                    $set: {
                      title: idea.title,
                      description: idea.description,
                      downvotes: idea.downvotes,
                      upvotes: idea.upvotes
                    }
                  })
                  const newIdea = await Idea.findById({_id: mongoIdeaId})
                  if (result.matchedCount === 0 ) {
                    return res.status(404).json({error: 'Idea not found'})
                  } else if (result.modifiedCount === 1) {
                    return res.status(200).json({message: 'Success', idea: newIdea})
                  } else if (result.modifiedCount === 0) {
                    return res.status(304).end()
                  } else {
                    return res.status(500).json({error: 'Idea could not be edited'})
                  }

                } catch {
                  return res.status(500).json({error: 'Could not update idea'})
                }
              } catch {
                return res.status(400).json({error: "Bad request. Error parsing idea tags."})
              }
            } catch {
              return res.status(500).json({error: 'Could not edit Idea.'})
            }
          } else {
            return res.status(401).json({error: 'Unauthorized.'})
          }
        }
      }
    } catch {
      return res.status(500).json({error: "Unable to fulfill request due to some error"})
    }
  }
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
          let theIdea: IIdea | null
          switch (voteType) {
            case 0:
              await resetVote(mongoUserId, mongoIdeaId)
              theIdea = await Idea.findById(mongoIdeaId)
              res.status(200).json({message: "Removed upvote/downvote", idea: theIdea})
              break

            case 1:
              await resetVote(mongoUserId, mongoIdeaId)
              await Idea.updateOne({ _id: mongoIdeaId}, {
                $push: {
                  upvotes: mongoUserId,
                }
              })
              theIdea = await Idea.findById(mongoIdeaId)
              res.status(200).json({message: "Added upvote", idea: theIdea})
              break

            case 2:
              await resetVote(mongoUserId, mongoIdeaId)
              await Idea.updateOne({ _id: mongoIdeaId}, {
                $push: {
                  downvotes: mongoUserId,
                }
              })
              theIdea = await Idea.findById(mongoIdeaId)
              res.status(200).json({message: "Added downvote", idea: theIdea})
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
  getIdeaById,
  getIdeaByUserId,
  createIdea,
  editIdea,
  deleteIdea,
  voteIdea
}
