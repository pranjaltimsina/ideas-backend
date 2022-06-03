import { Request, Response, NextFunction } from 'express'
import { auth } from 'google-auth-library'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'shh'

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  let authorization = req.headers.authorization

  if (!authorization) {
    return res.status(401).json({
      error: "Auth token not found in header."
    })
  } else {
    if (authorization.startsWith('Bearer')) {
      authorization = authorization.split(' ')[1]
    }

    jwt.verify(authorization, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          error: "Invalid token."
        })
      }

      next()
    })
  }
}

export default verifyJWT
