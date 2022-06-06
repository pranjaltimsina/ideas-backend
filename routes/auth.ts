import express, { NextFunction, Request, Response, Router } from 'express'
import { LoginTicket, TokenPayload } from 'google-auth-library'
import jwt from 'jsonwebtoken'

import verifyGoogleUser from '../middlewares/ticket'

import User from '../models/user'

const JWT_SECRET: string = process.env.JWT_SECRET || 'shhh'

const router: Router = express.Router()

router.post('/google', verifyGoogleUser, async (req: Request, res: Response) => {
  try {
    const ticket: LoginTicket = res.locals.ticket

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

      await newUser.save((saveErr: any, savedUser: any) => {
        if (saveErr) {
          res.status(502).json({error: "Could not create user"})
        } else {
          return res.status(201).json({
            data: savedUser,
            token: newToken
          })
        }
      })
    } else {
      return res.status(200).json({data: currentUser, token: newToken})
    }
  } catch (err) {
    console.log(err)
    return res.status(401).json({error: "Unauthorized."})
  }
})

export default router
