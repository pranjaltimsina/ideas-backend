import express, { Request, Response, Router } from 'express'

import { LoginTicket, OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'

import User from '../models/user'

const CLIENT_ID: string = process.env.G_CLIENT_ID || ''
const JWT_SECRET: string = process.env.JWT_SECRET || 'shhh'

const router: Router = express.Router()
const client: OAuth2Client = new OAuth2Client(CLIENT_ID)

const verify = async (token: string): Promise<LoginTicket> => {
  const ticket: LoginTicket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID
  })
  return ticket
}

router.post('/google', async (req: Request, res: Response) => {
  const userToken: string = req.body.token
  try {
    const ticket = await verify(userToken)

    const userID = ticket.getUserId() || ''

    const currentUser = await User.findOne({
      googleId: userID
    })

    if (!currentUser) {
      const newUser = await new User({
        name: ticket.getPayload()?.name,
        googleId: userID
      }).save()
    }

    const newToken: string = jwt.sign(userID, JWT_SECRET)

    res.status(200).json({token: newToken})
  } catch (err) {
    console.log(err)
    res.status(401).json({message: "Unauthorized"})
  }
})

export default router
