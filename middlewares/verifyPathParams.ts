import { Request, Response, NextFunction } from 'express'

import { isValidObjectId } from 'mongoose'

const verifyPathParams = (paramsToVerify: string[]) => {
  const verifier = (req: Request, res: Response, next: NextFunction) => {
    for (const param of paramsToVerify) {
      if (req.params[param] === undefined) {
        return res.status(400).json({ error: `Bad Request. Missing ${param} in the URL` })
      } else if (!isValidObjectId(req.params[param])) {
        return res.status(400).json({ error: `Bad Request. ${req.params[param]} is not a valid object Id.` })
      } else {
        try {
          res.locals[param] = req.params[param]
        } catch {
          return res.status(500).json({ error: 'Could not parse URL params.' })
        }
      }
    }
    next()
  }

  return verifier
}

export default verifyPathParams
