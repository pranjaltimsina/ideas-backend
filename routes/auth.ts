import express, { NextFunction, Request, Response, Router } from 'express'

import { LoginTicket, OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'

import User from '../models/user'

const CLIENT_ID: string = process.env.G_CLIENT_ID || ''
const JWT_SECRET: string = process.env.JWT_SECRET || 'shhh'

const router: Router = express.Router()
const client: OAuth2Client = new OAuth2Client(CLIENT_ID)

const verifyV2 = async (req: Request, res: Response, next: NextFunction) => {
  const userToken: string = req.body.token
  res.locals.userToken = userToken
  if (!userToken) {
    return res.status(400).json({error: "Bad request. Perhaps you forgot to send the user Token."})
  }
  await client.verifyIdToken({
    idToken: userToken,
    audience: CLIENT_ID
  }, (err: Error | null, login?: LoginTicket | undefined) => {
    if (err) {
      return res.status(401).json({error: "Bad token."})
    } else {
      res.locals.ticket = login
      next()
    }
  })
}

router.post('/google', verifyV2, async (req: Request, res: Response) => {
  const userToken: string = res.locals.userToken

  try {
    const ticket = res.locals.ticket

    const ticketPayload = ticket.getPayload()

    const userID = ticket.getUserId() || ''

    const currentUser = await User.findOne({
      googleId: userID
    })

    const newToken: string = jwt.sign(userID, JWT_SECRET)

    if (!currentUser) {
      const newUser = await new User({
        googleId: userID,
        name: ticketPayload?.name,
        givenName: ticketPayload?.given_name,
        familyName: ticketPayload?.family_name,
        email: ticketPayload?.email,
        picture: ticketPayload?.picture
      })

      newUser.save((saveErr: any, savedUser: any) => {
        return res.status(201).json({
          data: savedUser,
          token: newToken
        })
      })
    }


    return res.status(200).json({data: currentUser, token: newToken})
  } catch (err) {
    console.log(err)
    return res.status(401).json({error: "Unauthorized."})
  }
})

export default router
