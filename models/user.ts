import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: String,
  givenName: String,
  familyName: String,
  googleId: String,
  email: String,
  picture: String
})

const User = mongoose.model('user', userSchema)

export default User
