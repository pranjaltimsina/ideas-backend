import { Request, Response } from 'express'

import Idea from '../models/idea'

const getAllIdeas = (req: Request, res: Response) => {

}

interface reqIdea {
  title: string,
  body: string,
  tags?: string[],
  upvotes?: number,
  downvotes?: number,
  comments ?: any
}

const createIdea = (req: Request, res: Response) => {
  const idea: reqIdea = req.body.idea

  console.log(idea)

  res.status(201).json({
    message: "Successfully created idea."
  })

}

const editIdea = (req: Request, res: Response) => {

}

const deleteIdea = (req: Request, res: Response) => {

}

const upvoteIdea = (req: Request, res: Response) => {

}

const downvoteIdea = (req: Request, res: Response) => {

}

export {
  getAllIdeas,
  createIdea,
  editIdea,
  deleteIdea,
  upvoteIdea,
  downvoteIdea
}
