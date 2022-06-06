import express, { Request, Response, Router } from 'express'
import jwt from 'jsonwebtoken'

import verify from '../middlewares/ticket'

import User from '../models/user'

const JWT_SECRET: string = process.env.JWT_SECRET || 'shhh'

const router: Router = express.Router()

router.post('/google', verify, async (req: Request, res: Response) => {
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
