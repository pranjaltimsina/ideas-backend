import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { isValidObjectId } from 'mongoose'

const JWT_SECRET = process.env.JWT_SECRET || 'shh'

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  let authorization = req.headers.authorization
  if (!authorization) {
    return res.status(401).json({
      error: 'Auth token not found in header.'
    })
  } else {
    if (authorization.startsWith('Bearer')) {
      authorization = authorization.split(' ')[1]
    }
    res.locals.authorization = authorization
    jwt.verify(authorization, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          error: 'Invalid auth token.'
        })
      } else {
        res.locals.user = user
        if (!isValidObjectId(res.locals.user.id)) {
          return res.status(404).json({ error: 'Bad request. Invalid userId encoded in auth token.' })
        }
        return next()
      }
    })
  }
}

export default verifyJWT
